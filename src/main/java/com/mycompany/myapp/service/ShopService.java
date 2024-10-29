package com.mycompany.myapp.service;

import static com.mycompany.myapp.security.AuthoritiesConstants.*;
import static com.mycompany.myapp.security.AuthoritiesConstants.SUPERUSER;
import static com.mycompany.myapp.security.SecurityUtils.getAuthorities;

import com.mycompany.myapp.domain.Shop;
import com.mycompany.myapp.domain.Ticket;
import com.mycompany.myapp.domain.User;
import com.mycompany.myapp.repository.ShopRepository;
import com.mycompany.myapp.repository.TicketRepository;
import com.mycompany.myapp.repository.UserRepository;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service class for managing users.
 */
@Service
@Transactional
public class ShopService {

    private final Logger log = LoggerFactory.getLogger(ShopService.class);
    private final UserRepository userRepository;
    private final TicketRepository ticketRepository;
    private final ShopRepository shopRepository;

    public ShopService(UserRepository userRepository, TicketRepository ticketRepository, ShopRepository shopRepository) {
        this.userRepository = userRepository;
        this.ticketRepository = ticketRepository;
        this.shopRepository = shopRepository;
    }

    public Shop updateShop(Shop shop) {
        shopRepository.save(shop);
        return shop;
    }

    public Page<Shop> listShop(Pageable pageable, String searchShopCode, String searchName, String searchProvince) {
        Page<Shop> listShop = new PageImpl<>(Collections.emptyList(), PageRequest.of(0, 10), 0);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username;
        User user = new User();
        Object principal = authentication.getPrincipal();
        UserDetails userDetails = (UserDetails) principal;
        username = userDetails.getUsername();
        user = userRepository.findOneByLogin(username).get();
        if (
            authentication != null &&
            getAuthorities(authentication).anyMatch(authority -> Arrays.asList(USER).contains(authority)) &&
            !getAuthorities(authentication).anyMatch(authority -> Arrays.asList(ADMIN).contains(authority)) &&
            !getAuthorities(authentication).anyMatch(authority -> Arrays.asList(SUPERUSER).contains(authority))
        ) {
            listShop = shopRepository.findAllShopCode(searchName.toLowerCase(), searchProvince.toLowerCase(), user.getShopCode(), pageable);
        } else if (
            authentication != null &&
            !getAuthorities(authentication).anyMatch(authority -> Arrays.asList(USER).contains(authority)) &&
            !getAuthorities(authentication).anyMatch(authority -> Arrays.asList(ADMIN).contains(authority)) &&
            getAuthorities(authentication).anyMatch(authority -> Arrays.asList(SUPERUSER).contains(authority))
        ) {
            listShop =
                shopRepository.findAllProvince(searchShopCode.toLowerCase(), searchName.toLowerCase(), user.getDepartment(), pageable);
        } else {
            listShop =
                shopRepository.findAll(searchShopCode.toLowerCase(), searchName.toLowerCase(), searchProvince.toLowerCase(), pageable);
        }

        return listShop;
    }
}
