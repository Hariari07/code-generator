CREATE TABLE IF NOT EXISTS `default`.`userProfile` (
  `iduserProfile` BIGINT(100) NOT NULL AUTO_INCREMENT,
  `companyName` VARCHAR(100) NULL,
  `address1` VARCHAR(100) NULL,
  `address2` VARCHAR(100) NULL,
  `pinCode` BIGINT NULL,
  `country` VARCHAR(45) NULL,
  `state` VARCHAR(45) NULL,
  `contactNo` BIGINT NULL,
  `category` VARCHAR(45) NULL DEFAULT NULL,
  `subCategory` VARCHAR(45) NULL DEFAULT NULL,
  `emailid` VARCHAR(100) NULL DEFAULT NULL,
  `currencyCode` VARCHAR(45) NULL,
  `proimg` LONGBLOB NULL DEFAULT NULL,
  `activeStatus` VARCHAR(45) NULL,
  PRIMARY KEY (`iduserProfile`))
ENGINE = InnoDB