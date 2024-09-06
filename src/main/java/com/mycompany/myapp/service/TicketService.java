package com.mycompany.myapp.service;

import static com.mycompany.myapp.security.AuthoritiesConstants.*;
import static com.mycompany.myapp.security.SecurityUtils.getAuthorities;

import com.mycompany.myapp.domain.Ticket;
import com.mycompany.myapp.domain.User;
import com.mycompany.myapp.repository.TicketRepository;
import com.mycompany.myapp.repository.UserRepository;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
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
public class TicketService {

    private final Logger log = LoggerFactory.getLogger(TicketService.class);

    private final UserRepository userRepository;
    private final TicketRepository ticketRepository;

    public TicketService(UserRepository userRepository, TicketRepository ticketRepository) {
        this.userRepository = userRepository;
        this.ticketRepository = ticketRepository;
    }

    public Ticket updateTicket(Ticket ticket) {
        String username;
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        UserDetails userDetails = (UserDetails) principal;
        username = userDetails.getUsername();
        User user = userRepository.findOneByLogin(username).get();
        if (ticket.getClosedTime() == null && ticket.getStatus().equals("Đã đóng")) {
            ticket.setClosedTime(LocalDate.now());
            ticket.setChangeBy(user.getName());
        }
        ticketRepository.save(ticket);
        return ticket;
    }

    public Page<Ticket> getAllTickets(Pageable pageable, String searchPhone, String searchService, String searchTime) {
        Page<Ticket> page = new PageImpl<>(Collections.emptyList(), PageRequest.of(0, 10), 0);

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
        ) {} else if (
            authentication != null &&
            !getAuthorities(authentication).anyMatch(authority -> Arrays.asList(USER).contains(authority)) &&
            !getAuthorities(authentication).anyMatch(authority -> Arrays.asList(ADMIN).contains(authority)) &&
            getAuthorities(authentication).anyMatch(authority -> Arrays.asList(SUPERUSER).contains(authority))
        ) {
            if (searchTime == null || searchTime.equals("null")) {
                page = ticketRepository.listTicketNoTimeDepartment(searchPhone, searchService, user.getDepartment(), pageable);
            } else page = ticketRepository.listTicketDepartment(searchPhone, searchService, searchTime, user.getDepartment(), pageable);
        } else {
            if (searchTime == null || searchTime.equals("null")) {
                page = ticketRepository.listTicketNoTime(searchPhone, searchService, pageable);
            } else page = ticketRepository.listTicket(searchPhone, searchService, searchTime, pageable);
        }
        return page;
    }
}
