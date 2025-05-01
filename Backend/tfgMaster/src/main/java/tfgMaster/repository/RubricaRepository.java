package tfgMaster.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tfgMaster.entity.Rubrica;

@Repository
public interface RubricaRepository extends JpaRepository<Rubrica, Integer>{
}
