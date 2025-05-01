package tfgMaster.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tfgMaster.entity.Alumno;

@Repository
public interface AlumnoRepository extends JpaRepository<Alumno, Integer> {
	public Optional<Alumno> findByUsername(String username);
}
