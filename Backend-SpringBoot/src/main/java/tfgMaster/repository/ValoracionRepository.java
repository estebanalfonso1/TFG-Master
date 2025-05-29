package tfgMaster.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tfgMaster.entity.Valoracion;

@Repository
public interface ValoracionRepository extends JpaRepository<Valoracion, Integer> {
}
