SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema faro
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `faro` ;
CREATE SCHEMA IF NOT EXISTS `faro` ;
USE `faro` ;

-- -----------------------------------------------------
-- Table `faro`.`profiles`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `faro`.`profile` ;
CREATE TABLE IF NOT EXISTS `faro`.`profile` (
  `id` BINARY(16) NOT NULL,
  `users_profile_profile_picture` MEDIUMBLOB NULL,
  `headline` VARCHAR(128)  NULL,
  `description` VARCHAR(512) NULL,
  `occupation_status` ENUM('Working', 'Studying', 'Looking for a job') NULL,
  `education_id` BINARY(16) NULL,
  `recommendations_id` BINARY(16) NULL,
  `experience_id` BINARY(16) NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_profiles_education`
    FOREIGN KEY (`education_id`)
    REFERENCES `faro`.`education` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `fk_profiles_recommendations`
    FOREIGN KEY (`recommendations_id`)
    REFERENCES `faro`.`recommendations` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `fk_profiles_experience`
    FOREIGN KEY (`experience_id`)
    REFERENCES `faro`.`experience` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);


-- -----------------------------------------------------
-- Table `faro`.`users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `faro`.`users` ;
CREATE TABLE IF NOT EXISTS `faro`.`users` (
  `id` BINARY(16) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `first_surname` VARCHAR(45) NOT NULL,
  `second_surname` VARCHAR(45) NULL,
  `email` VARCHAR(254) NOT NULL,
  `password` VARCHAR(60) NOT NULL,
  `role` ENUM('admin', 'teacher', 'company', 'student') NOT NULL,
  `users_profiles_user_profile_id` BINARY(16) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  INDEX `fk_users_profiles_idx` (`users_profiles_user_profile_id` ASC) VISIBLE,
  CONSTRAINT `fk_users_profiles`
    FOREIGN KEY (`users_profiles_user_profile_id`)
    REFERENCES `faro`.`profiles` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION

);

-- -----------------------------------------------------
-- Table `faro`.`publications`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `faro`.`publications` ;
CREATE TABLE IF NOT EXISTS `faro`.`publications` (
  `id` BINARY(16) NOT NULL,
  `msg` VARCHAR(2048) NOT NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` BINARY(16) NOT NULL,
  `users_profiles_user_profile_id` BINARY(16) NOT NULL,
  PRIMARY KEY (`id`, `users_profiles_user_profile_id`),
  INDEX `fk_publications_users1_idx` (`user_id` ASC, `users_profiles_user_profile_id` ASC) VISIBLE,
  CONSTRAINT `fk_users_publications_users1`
    FOREIGN KEY (`user_id`, `users_profiles_user_profile_id`)
    REFERENCES `faro`.`users` (`id`, `users_profiles_user_profile_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

-- -----------------------------------------------------
-- Table `faro`.`direct_messages`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `faro`.`direct_messages` ;
CREATE TABLE IF NOT EXISTS `faro`.`direct_messages` (
  `user_direct_message_msg` VARCHAR(1024) NOT NULL,
  `user_direct_message_sender` BINARY(16) NOT NULL,
  `user_direct_message_receiver` BINARY(16) NOT NULL,
  `user_id` BINARY(16) NOT NULL,
  `users_profiles_user_profile_id` BINARY(16) NOT NULL,
  PRIMARY KEY (`user_direct_message_receiver`, `user_direct_message_sender`, `user_id`, `users_profiles_user_profile_id`),
  INDEX `fk_direct_messages_users1_idx` (`user_id` ASC, `users_profiles_user_profile_id` ASC) VISIBLE,
  CONSTRAINT `fk_users_direct_messages_users1`
    FOREIGN KEY (`user_id`, `users_profiles_user_profile_id`)
    REFERENCES `faro`.`users` (`id`, `users_profiles_user_profile_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

-- -----------------------------------------------------
-- Table `faro`.`connection`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `faro`.`connection`;
CREATE TABLE IF NOT EXISTS `faro`.`connection` (
  `id` BINARY(16) NOT NULL,
  PRIMARY KEY (`id`)
);

-- -----------------------------------------------------
-- Table `faro`.`profiles_connection`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `faro`.`profiles_connection`;
CREATE TABLE IF NOT EXISTS `faro`.`profiles_connection` (
  `profile_id` BINARY(16) NOT NULL,
  `connection_id` BINARY(16) NOT NULL,
  PRIMARY KEY (`profile_id`, `connection_id`),
  INDEX `fk_profiles_connection_profiles_idx` (`profile_id` ASC) VISIBLE,
  INDEX `fk_profiles_connection_connection_idx` (`connection_id` ASC) VISIBLE,
  CONSTRAINT `fk_profiles_connection_profiles`
    FOREIGN KEY (`profile_id`)
    REFERENCES `faro`.`profiles` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_profiles_connection_connection`
    FOREIGN KEY (`connection_id`)
    REFERENCES `faro`.`connection` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Table `faro`.`education`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `faro`.`education` ;
CREATE TABLE IF NOT EXISTS `faro`.`education` (
  `id` BINARY(16) NOT NULL,
  `profile_id` BINARY(16) NOT NULL,
  `institution` VARCHAR(128) NOT NULL,
  `degree` VARCHAR(128) NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_education_profiles`
    FOREIGN KEY (`profile_id`)
    REFERENCES `faro`.`profiles` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Table `faro`.`recommendations`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `faro`.`recommendations` ;
CREATE TABLE IF NOT EXISTS `faro`.`recommendations` (
  `id` BINARY(16) NOT NULL,
  `profile_id` BINARY(16) NOT NULL,
  `sender_id` BINARY(16) NOT NULL,
  `message` VARCHAR(1024) NOT NULL,
  `date` DATE NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_recommendations_profiles`
    FOREIGN KEY (`profile_id`)
    REFERENCES `faro`.`profiles` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_recommendations_users`
    FOREIGN KEY (`sender_id`)
    REFERENCES `faro`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);


-- -----------------------------------------------------
-- Table `faro`.`experience`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `faro`.`experience` ;
CREATE TABLE IF NOT EXISTS `faro`.`experience` (
  `id` BINARY(16) NOT NULL,
  `profile_id` BINARY(16) NOT NULL,
  `company` VARCHAR(128) NOT NULL,
  `position` VARCHAR(128) NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NULL,
  `description` VARCHAR(512) NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_experience_profiles`
    FOREIGN KEY (`profile_id`)
    REFERENCES `faro`.`profiles` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
