package com.ezvector.backend.repository;

import com.ezvector.backend.model.Cart;
import com.ezvector.backend.model.Customer;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface CartRepository extends CrudRepository<Cart, Integer> {
    Optional<Cart> findByCustomer(Customer customer);
}
