package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Ticket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Ticket entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    @Query(
        "select a from Ticket a where a.phone LIKE %:searchPhone% AND a.serviceType LIKE %:searchService% AND a.createdTime = TO_DATE(:searchTime, 'YYYY-MM-DD')"
    )
    Page<Ticket> listTicket(
        @Param("searchPhone") String searchPhone,
        @Param("searchService") String searchService,
        @Param("searchTime") String searchTime,
        Pageable pageable
    );

    @Query("select a from Ticket a where a.phone LIKE %:searchPhone% AND a.serviceType LIKE %:searchService%")
    Page<Ticket> listTicketNoTime(
        @Param("searchPhone") String searchPhone,
        @Param("searchService") String searchService,
        Pageable pageable
    );

    @Query(
        "select a from Ticket a where a.phone LIKE %:searchPhone% AND a.serviceType LIKE %:searchService% AND a.createdTime = TO_DATE(:searchTime, 'YYYY-MM-DD') AND a.province = :department"
    )
    Page<Ticket> listTicketDepartment(
        @Param("searchPhone") String searchPhone,
        @Param("searchService") String searchService,
        @Param("searchTime") String searchTime,
        @Param("department") String department,
        Pageable pageable
    );

    @Query("select a from Ticket a where a.phone LIKE %:searchPhone% AND a.serviceType LIKE %:searchService% AND a.province = :department")
    Page<Ticket> listTicketNoTimeDepartment(
        @Param("searchPhone") String searchPhone,
        @Param("searchService") String searchService,
        @Param("department") String department,
        Pageable pageable
    );
}
