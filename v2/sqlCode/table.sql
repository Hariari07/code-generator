CREATE TABLE IF NOT EXISTS `hlmmasters`.`userProfile` (  
  `userId` BIGINT UNSIGNED NULL,
  `companyName` VARCHAR(150) NULL,
  `address1` VARCHAR(150) NULL,
  `address2` VARCHAR(150) NULL,
  `city` VARCHAR(100) NULL,
  `state` VARCHAR(100) NULL,
  `country` VARCHAR(100) NULL,
  `pinCode` VARCHAR(10) NULL,
  `latitude` DECIMAL(10,8) NULL,
  `longitude` DECIMAL(11,8) NULL,
  `contactNo` VARCHAR(15) NULL,
  `emailid` VARCHAR(150) NULL DEFAULT NULL,
  `currencyCode` VARCHAR(10) NULL,
  `profileImageUrl` VARCHAR(255) NULL DEFAULT NULL,  
  PRIMARY KEY (`id`))
ENGINE = InnoDB