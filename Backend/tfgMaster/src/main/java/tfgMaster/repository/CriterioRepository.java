package tfgMaster.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tfgMaster.entity.Criterio;

@Repository
public interface CriterioRepository extends JpaRepository<Criterio, Integer>{
}
