package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Ticket;
import javax.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Ticket entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    @Query(
        "select a from Ticket a where LOWER(a.phone) LIKE %:searchPhone% AND LOWER(a.serviceType) LIKE %:searchService% AND a.createdTime = TO_DATE(:searchTime, 'YYYY-MM-DD') and a.province like %:searchProvince%"
    )
    Page<Ticket> listTicket(
        @Param("searchPhone") String searchPhone,
        @Param("searchService") String searchService,
        @Param("searchTime") String searchTime,
        @Param("searchProvince") String searchProvince,
        Pageable pageable
    );

    @Query(
        "select a from Ticket a where LOWER(a.phone) LIKE %:searchPhone% AND LOWER(a.serviceType) LIKE %:searchService% AND a.province like %:searchProvince%"
    )
    Page<Ticket> listTicketNoTime(
        @Param("searchPhone") String searchPhone,
        @Param("searchService") String searchService,
        @Param("searchProvince") String searchProvince,
        Pageable pageable
    );

    @Query(
        "select a from Ticket a where LOWER(a.phone) LIKE %:searchPhone% AND LOWER(a.serviceType) LIKE %:searchService% AND a.createdTime = TO_DATE(:searchTime, 'YYYY-MM-DD') AND a.province = :department"
    )
    Page<Ticket> listTicketDepartment(
        @Param("searchPhone") String searchPhone,
        @Param("searchService") String searchService,
        @Param("searchTime") String searchTime,
        @Param("department") String department,
        Pageable pageable
    );

    @Query(
        "select a from Ticket a where LOWER(a.phone) LIKE %:searchPhone% AND LOWER(a.serviceType) LIKE %:searchService% AND a.province = :department"
    )
    Page<Ticket> listTicketNoTimeDepartment(
        @Param("searchPhone") String searchPhone,
        @Param("searchService") String searchService,
        @Param("department") String department,
        Pageable pageable
    );

    @Query(
        "select a from Ticket a where LOWER(a.phone) LIKE %:searchPhone% AND LOWER(a.serviceType) LIKE %:searchService% AND a.createdTime = TO_DATE(:searchTime, 'YYYY-MM-DD') AND  a.shopCode like %:shopCode%"
    )
    Page<Ticket> listTicketShopCode(
        @Param("searchPhone") String searchPhone,
        @Param("searchService") String searchService,
        @Param("searchTime") String searchTime,
        @Param("shopCode") String shopCode,
        Pageable pageable
    );

    @Query(
        "select a from Ticket a where LOWER(a.phone) LIKE %:searchPhone% AND LOWER(a.serviceType) LIKE %:searchService% AND a.shopCode like %:shopCode%"
    )
    Page<Ticket> listTicketNoTimeShopCode(
        @Param("searchPhone") String searchPhone,
        @Param("searchService") String searchService,
        @Param("shopCode") String shopCode,
        Pageable pageable
    );

    @Procedure
    void SMS_KHAO_SAT(@Param("idTicket") String idTicket, @Param("phoneCheck") String phoneCheck, @Param("user") String user);
}
