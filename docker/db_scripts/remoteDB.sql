SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema faro_followupon
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `faro_followupon` ;
CREATE SCHEMA IF NOT EXISTS `faro_followupon` ;
USE `faro_followupon` ;

-- -----------------------------------------------------
-- Table `faro_followupon`.`profiles`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `faro_followupon`.`profile` ;
CREATE TABLE IF NOT EXISTS `faro_followupon`.`profile` (
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
    REFERENCES `faro_followupon`.`education` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `fk_profiles_recommendations`
    FOREIGN KEY (`recommendations_id`)
    REFERENCES `faro_followupon`.`recommendations` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `fk_profiles_experience`
    FOREIGN KEY (`experience_id`)
    REFERENCES `faro_followupon`.`experience` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);


-- -----------------------------------------------------
-- Table `faro_followupon`.`users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `faro_followupon`.`users` ;
CREATE TABLE IF NOT EXISTS `faro_followupon`.`users` (
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
    REFERENCES `faro_followupon`.`profiles` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  UNIQUE KEY `unique_user_profile` (`id`, `users_profiles_user_profile_id`)
);

-- -----------------------------------------------------
-- Table `faro_followupon`.`publications`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `faro_followupon`.`publications` ;
CREATE TABLE IF NOT EXISTS `faro_followupon`.`publications` (
  `id` BINARY(16) NOT NULL,
  `msg` VARCHAR(2048) NOT NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` BINARY(16) NOT NULL,
  `users_profiles_user_profile_id` BINARY(16) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_publications_users1_idx` (`user_id` ASC, `users_profiles_user_profile_id` ASC) VISIBLE,
  CONSTRAINT `fk_users_publications_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `faro_followupon`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_users_publications_profiles`
    FOREIGN KEY (`users_profiles_user_profile_id`)
    REFERENCES `faro_followupon`.`profiles` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

-- -----------------------------------------------------
-- Table `faro_followupon`.`direct_messages`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `faro_followupon`.`direct_messages` ;
CREATE TABLE IF NOT EXISTS `faro_followupon`.`direct_messages` (
  `user_direct_message_msg` VARCHAR(1024) NOT NULL,
  `user_direct_message_sender` BINARY(16) NOT NULL,
  `user_direct_message_receiver` BINARY(16) NOT NULL,
  `user_id` BINARY(16) NOT NULL,
  `users_profiles_user_profile_id` BINARY(16) NOT NULL,
  PRIMARY KEY (`user_direct_message_receiver`, `user_direct_message_sender`, `user_id`, `users_profiles_user_profile_id`),
  INDEX `fk_direct_messages_users1_idx` (`user_id` ASC, `users_profiles_user_profile_id` ASC) VISIBLE,
  CONSTRAINT `fk_users_direct_messages_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `faro_followupon`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_users_direct_messages_profiles`
    FOREIGN KEY (`users_profiles_user_profile_id`)
    REFERENCES `faro_followupon`.`profiles` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);


-- -----------------------------------------------------
-- Table `faro_followupon`.`connection`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `faro_followupon`.`connection`;
CREATE TABLE IF NOT EXISTS `faro_followupon`.`connection` (
  `id` BINARY(16) NOT NULL,
  PRIMARY KEY (`id`)
);

-- -----------------------------------------------------
-- Table `faro_followupon`.`profiles_connection`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `faro_followupon`.`profiles_connection`;
CREATE TABLE IF NOT EXISTS `faro_followupon`.`profiles_connection` (
  `profile_id` BINARY(16) NOT NULL,
  `connection_id` BINARY(16) NOT NULL,
  PRIMARY KEY (`profile_id`, `connection_id`),
  INDEX `fk_profiles_connection_profiles_idx` (`profile_id` ASC) VISIBLE,
  INDEX `fk_profiles_connection_connection_idx` (`connection_id` ASC) VISIBLE,
  CONSTRAINT `fk_profiles_connection_profiles`
    FOREIGN KEY (`profile_id`)
    REFERENCES `faro_followupon`.`profiles` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_profiles_connection_connection`
    FOREIGN KEY (`connection_id`)
    REFERENCES `faro_followupon`.`connection` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Table `faro_followupon`.`education`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `faro_followupon`.`education` ;
CREATE TABLE IF NOT EXISTS `faro_followupon`.`education` (
  `id` BINARY(16) NOT NULL,
  `profile_id` BINARY(16) NOT NULL,
  `institution` VARCHAR(128) NOT NULL,
  `degree` VARCHAR(128) NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_education_profiles`
    FOREIGN KEY (`profile_id`)
    REFERENCES `faro_followupon`.`profiles` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Table `faro_followupon`.`recommendations`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `faro_followupon`.`recommendations` ;
CREATE TABLE IF NOT EXISTS `faro_followupon`.`recommendations` (
  `id` BINARY(16) NOT NULL,
  `profile_id` BINARY(16) NOT NULL,
  `sender_id` BINARY(16) NOT NULL,
  `message` VARCHAR(1024) NOT NULL,
  `date` DATE NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_recommendations_profiles`
    FOREIGN KEY (`profile_id`)
    REFERENCES `faro_followupon`.`profiles` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_recommendations_users`
    FOREIGN KEY (`sender_id`)
    REFERENCES `faro_followupon`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);


-- -----------------------------------------------------
-- Table `faro_followupon`.`experience`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `faro_followupon`.`experience` ;
CREATE TABLE IF NOT EXISTS `faro_followupon`.`experience` (
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
    REFERENCES `faro_followupon`.`profiles` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Table `faro_followupon`.`comments`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `faro_followupon`.`comments` ;
CREATE TABLE IF NOT EXISTS `faro_followupon`.`comments` (
  `id` BINARY(16) NOT NULL,
  `publication_id` BINARY(16) NOT NULL,
  `user_id` BINARY(16) NOT NULL,
  `comment` VARCHAR(1024) NOT NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`, `publication_id`, `user_id`),
  CONSTRAINT `fk_comments_publications`
    FOREIGN KEY (`publication_id`)
    REFERENCES `faro_followupon`.`publications` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_comments_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `faro_followupon`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Table `faro_followupon`.`likes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `faro_followupon`.`likes` ;
CREATE TABLE IF NOT EXISTS `faro_followupon`.`likes` (
  `user_id` BINARY(16) NOT NULL,
  `publication_id` BINARY(16) NOT NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`, `publication_id`),
  CONSTRAINT `fk_likes_publications`
    FOREIGN KEY (`publication_id`)
    REFERENCES `faro_followupon`.`publications` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_likes_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `faro_followupon`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);