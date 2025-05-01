package tfgMaster.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tfgMaster.entity.Profesor;

@Repository
public interface ProfesorRepository extends JpaRepository<Profesor, Integer> {
	public Optional<Profesor> findByUsername(String username);
}
