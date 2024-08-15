package com.mycompany.myapp.web.rest;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.gson.Gson;
import com.mycompany.myapp.domain.Authority;
import com.mycompany.myapp.domain.Login;
import com.mycompany.myapp.domain.User;
import com.mycompany.myapp.repository.UserRepository;
import com.mycompany.myapp.security.jwt.JWTFilter;
import com.mycompany.myapp.security.jwt.TokenProvider;
import com.mycompany.myapp.web.rest.vm.LoginVM;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Set;
import javax.validation.Valid;
import org.springframework.http.*;
import org.springframework.ldap.AuthenticationException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

/**
 * Controller to authenticate users.
 */
@RestController
@RequestMapping("/api")
public class UserJWTController {

    private final RestTemplate restTemplate;
    private final TokenProvider tokenProvider;
    private final UserRepository userRepository;

    private final AuthenticationManagerBuilder authenticationManagerBuilder;

    public UserJWTController(
        RestTemplate restTemplate,
        TokenProvider tokenProvider,
        UserRepository userRepository,
        AuthenticationManagerBuilder authenticationManagerBuilder
    ) {
        this.restTemplate = restTemplate;
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
        this.authenticationManagerBuilder = authenticationManagerBuilder;
    }

    @PostMapping("/authenticate")
    public ResponseEntity<JWTToken> authorize(@Valid @RequestBody LoginVM loginVM) {
        User user = new User();
        user = userRepository.findOneByLogin(loginVM.getUsername()).get();
        Set<Authority> userAuthorities = user.getAuthorities();
        Collection<GrantedAuthority> grantedAuthorities = new ArrayList<>();
        for (Authority a : userAuthorities) {
            GrantedAuthority grantedAuthority = new SimpleGrantedAuthority(a.getName());
            grantedAuthorities.add(grantedAuthority);
        }
        //        Principal principal = new Principal();
        //        principal.setUserName(loginVM.getUsername());
        //        principal.setAccountNonExpired(true);
        //        principal.setAccountNonLocked(true);
        //        principal.setCredentialsNonExpired(true);
        //        principal.setAuthorities(grantedAuthorities);
        //        principal.setEnabled(true);
        //        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
        //            loginVM.getUsername(),
        //                loginVM.getPassword()
        //        );
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
            loginVM.getUsername(),
            "",
            grantedAuthorities
        );

        Login login = new Login();
        login.setName(loginVM.getUsername());
        login.setPassword(loginVM.getPassword());
        Gson gson = new Gson();
        String jsonString = gson.toJson(login);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> request = new HttpEntity<>(jsonString, headers);
        String apiUrl = "http://10.14.36.104:9000/api/loginLdap"; // Điều chỉnh URL của API của bạn ở đây
        String response = restTemplate.postForObject(apiUrl, request, String.class);
        if (response.equals("0") || response == null || response.equals("")) throw new AuthenticationException();
        //Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
        Authentication authentication = (Authentication) authenticationToken;
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.createToken(authentication, loginVM.isRememberMe());
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add(JWTFilter.AUTHORIZATION_HEADER, "Bearer " + jwt);
        return new ResponseEntity<>(new JWTToken(jwt), httpHeaders, HttpStatus.OK);
    }

    /**
     * Object to return as body in JWT Authentication.
     */
    static class JWTToken {

        private String idToken;

        JWTToken(String idToken) {
            this.idToken = idToken;
        }

        @JsonProperty("id_token")
        String getIdToken() {
            return idToken;
        }

        void setIdToken(String idToken) {
            this.idToken = idToken;
        }
    }
}
