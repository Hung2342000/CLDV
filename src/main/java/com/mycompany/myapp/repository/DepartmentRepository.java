package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Department;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Tool entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    @Query("select a from Department a where a.code like  %:code% ")
    Department findDepartmentByCode(@Param("code") String code);

    @Query("select a from Department a where a.id IN :id ")
    List<Department> findDepartmentByListID(@Param("id") List<Long> id);
}
