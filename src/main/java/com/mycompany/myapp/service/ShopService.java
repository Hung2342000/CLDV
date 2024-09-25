package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Shop;
import com.mycompany.myapp.repository.ShopRepository;
import com.mycompany.myapp.repository.TicketRepository;
import com.mycompany.myapp.repository.UserRepository;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
        Page<Shop> listShop = shopRepository.findAll(
            searchShopCode.toLowerCase(),
            searchName.toLowerCase(),
            searchProvince.toLowerCase(),
            pageable
        );
        return listShop;
    }
}
