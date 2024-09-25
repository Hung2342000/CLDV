package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Department;
import com.mycompany.myapp.domain.Shop;
import com.mycompany.myapp.domain.Ticket;
import com.mycompany.myapp.repository.DepartmentRepository;
import com.mycompany.myapp.repository.ShopRepository;
import com.mycompany.myapp.service.ShopService;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import oracle.jdbc.proxy.annotation.Post;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

@RestController
@RequestMapping("/api")
@Transactional
public class ShopResource {

    private final Logger log = LoggerFactory.getLogger(ShopResource.class);
    private final ShopRepository shopRepository;
    private final ShopService shopService;
    private static final String ENTITY_NAME = "shop";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    public ShopResource(ShopRepository shopRepository, ShopService shopService) {
        this.shopRepository = shopRepository;
        this.shopService = shopService;
    }

    @GetMapping("/shop/all")
    public ResponseEntity<List<Shop>> getAllShop() throws URISyntaxException {
        List<Shop> list = shopRepository.findAll();
        return ResponseEntity.ok().body(list);
    }

    @PostMapping("/shop")
    public ResponseEntity<Shop> createShop(@Valid @RequestBody Shop shop) throws URISyntaxException {
        log.debug("REST request to save Ticket : {}", shop);
        if (shop.getId() != null) {
            throw new BadRequestAlertException("A new ticket cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Shop result = shopRepository.save(shop);
        return ResponseEntity
            .created(new URI("/api/shop/" + result.getShopCode()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getShopCode().toString()))
            .body(result);
    }

    @GetMapping("/shop/{id}")
    public ResponseEntity<Shop> getShop(@PathVariable Long id) {
        log.debug("REST request to get Shop : {}", id);
        Optional<Shop> shop = shopRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(shop);
    }

    @GetMapping("/shop")
    public ResponseEntity<List<Shop>> getAllShops(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable,
        String searchShopCode,
        String searchName,
        String searchProvince
    ) {
        log.debug("REST request to get a page of Tickets");
        Page<Shop> page = shopService.listShop(pageable, searchShopCode, searchName, searchProvince);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    @PutMapping("/shop/{id}")
    public ResponseEntity<Shop> updateShop(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Shop shop)
        throws URISyntaxException {
        log.debug("REST request to update shop : {}, {}", id, shop);
        if (shop.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, shop.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!shopRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        Shop result = shopRepository.save(shop);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, shop.getId().toString()))
            .body(result);
    }

    @DeleteMapping("/shop/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        log.debug("REST request to delete Ticket : {}", id);
        shopRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
