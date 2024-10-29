package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Shop;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Tool entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ShopRepository extends JpaRepository<Shop, Long> {
    Shop findShopByShopCode(String shopCode);

    @Query(
        "select s from Shop s WHERE LOWER(s.name) like %:searchName% and  LOWER(s.province) like %:searchProvince% and s.shopCode like %:shopCode%"
    )
    Page<Shop> findAllShopCode(
        @Param("searchName") String searchName,
        @Param("searchProvince") String searchProvince,
        @Param("shopCode") String shopCode,
        Pageable pageable
    );

    @Query(
        "select s from Shop s WHERE LOWER(s.shopCode) like %:searchShopCode% and  LOWER(s.name) like %:searchName% and s.province like %:province%"
    )
    Page<Shop> findAllProvince(
        @Param("searchShopCode") String searchShopCode,
        @Param("searchName") String searchName,
        @Param("province") String province,
        Pageable pageable
    );

    @Query(
        "select s from Shop s WHERE LOWER(s.shopCode) like %:searchShopCode% and  LOWER(s.name) like %:searchName% and  LOWER(s.province) like %:searchProvince% "
    )
    Page<Shop> findAll(
        @Param("searchShopCode") String searchShopCode,
        @Param("searchName") String searchName,
        @Param("searchProvince") String searchProvince,
        Pageable pageable
    );
}
