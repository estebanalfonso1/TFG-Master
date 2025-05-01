package tfgMaster.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tfgMaster.entity.Tribunal;

@Repository
public interface TribunalRepository extends JpaRepository<Tribunal, Integer>{
}
