package com.ezvector.backend.repository;

import com.ezvector.backend.model.Customer;
import com.ezvector.backend.model.Fragment;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface FragmentRepository extends CrudRepository<Fragment, Integer> {
    List<Fragment> findByCustomerAndIsBackbone(Customer customer, boolean isBackbone);
}
