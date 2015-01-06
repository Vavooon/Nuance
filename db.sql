-- --------------------------------------------------------
-- Сервер:                       127.0.0.1
-- Версія сервера:               5.5.31-MariaDB - mariadb.org binary distribution
-- ОС сервера:                   Win64
-- HeidiSQL Версія:              9.1.0.4882
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping database structure for nuance_new
CREATE DATABASE IF NOT EXISTS `nuance_new` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `nuance_new`;


-- Dumping structure for таблиця nuance_new.city
CREATE TABLE IF NOT EXISTS `city` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(15) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for таблиця nuance_new.config
CREATE TABLE IF NOT EXISTS `config` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(50) DEFAULT NULL,
  `ownerid` int(11) DEFAULT NULL,
  `path` varchar(50) DEFAULT NULL,
  `vartype` varchar(50) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `value` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for таблиця nuance_new.group
CREATE TABLE IF NOT EXISTS `group` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` tinytext,
  `acl` text COMMENT 'acl',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for таблиця nuance_new.ip
CREATE TABLE IF NOT EXISTS `ip` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user` int(10) unsigned NOT NULL COMMENT 'link',
  `router` int(10) unsigned NOT NULL COMMENT 'link',
  `ip` tinytext NOT NULL,
  `mac` tinytext NOT NULL,
  `port` tinytext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for таблиця nuance_new.log
CREATE TABLE IF NOT EXISTS `log` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` tinytext,
  `subtype` tinytext,
  `master` int(10) unsigned DEFAULT NULL COMMENT 'link',
  `action` tinytext,
  `targetsection` tinytext,
  `targetid` int(10) unsigned DEFAULT NULL,
  `olddata` text,
  `newdata` text,
  `date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for таблиця nuance_new.master
CREATE TABLE IF NOT EXISTS `master` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `login` varchar(60) CHARACTER SET latin1 DEFAULT NULL,
  `password` varchar(64) CHARACTER SET latin1 DEFAULT NULL COMMENT 'md5password',
  `group` int(11) unsigned DEFAULT NULL COMMENT 'link',
  `disabled` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for таблиця nuance_new.message
CREATE TABLE IF NOT EXISTS `message` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `sender` int(10) DEFAULT NULL,
  `sender_is_admin` tinyint(1) DEFAULT NULL,
  `recipient` int(10) DEFAULT NULL,
  `recipient_is_admin` tinyint(1) DEFAULT NULL,
  `subject` tinytext,
  `text` mediumtext,
  `is_new` tinyint(1) DEFAULT NULL,
  `date` timestamp NULL DEFAULT NULL,
  `readdate` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for таблиця nuance_new.moneyflow
CREATE TABLE IF NOT EXISTS `moneyflow` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user` int(11) unsigned DEFAULT NULL COMMENT 'link',
  `detailsname` tinytext NOT NULL,
  `detailsid` int(11) DEFAULT NULL,
  `sum` float(9,2) DEFAULT NULL COMMENT 'money',
  `date` timestamp NULL DEFAULT NULL,
  `refund` tinyint(3) DEFAULT NULL,
  `name` text,
  `comment` text COMMENT 'multitext',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for таблиця nuance_new.order
CREATE TABLE IF NOT EXISTS `order` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user` int(10) unsigned DEFAULT NULL,
  `detailsname` varchar(50) DEFAULT NULL,
  `detailsid` int(10) unsigned DEFAULT NULL,
  `canceled` tinyint(1) DEFAULT NULL,
  `temp` tinyint(1) DEFAULT NULL,
  `date` timestamp NULL DEFAULT NULL,
  `startdate` timestamp NULL DEFAULT NULL,
  `enddate` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for таблиця nuance_new.ppp
CREATE TABLE IF NOT EXISTS `ppp` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user` int(10) unsigned NOT NULL COMMENT 'link',
  `router` int(10) unsigned NOT NULL COMMENT 'link',
  `login` tinytext NOT NULL,
  `password` tinytext NOT NULL,
  `localip` tinytext NOT NULL,
  `remoteip` tinytext NOT NULL,
  `pppservice` tinytext NOT NULL COMMENT 'charlink',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for таблиця nuance_new.router
CREATE TABLE IF NOT EXISTS `router` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL,
  `routertype` varchar(20) CHARACTER SET latin1 DEFAULT NULL COMMENT 'charlink',
  `login` varchar(40) CHARACTER SET latin1 DEFAULT NULL,
  `pass` varchar(40) CHARACTER SET latin1 DEFAULT NULL COMMENT 'password',
  `ip` tinytext CHARACTER SET latin1,
  `port` smallint(5) unsigned DEFAULT NULL,
  `comment` text COMMENT 'multitext',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for таблиця nuance_new.routerupdatequeue
CREATE TABLE IF NOT EXISTS `routerupdatequeue` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `router` int(10) unsigned DEFAULT '0',
  `mode` varchar(50) DEFAULT NULL,
  `user` int(10) unsigned DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for таблиця nuance_new.scratchcard
CREATE TABLE IF NOT EXISTS `scratchcard` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `code` char(16) DEFAULT NULL,
  `value` int(10) unsigned DEFAULT NULL COMMENT 'money',
  `user` int(10) unsigned DEFAULT NULL COMMENT 'link',
  `activated` tinyint(1) DEFAULT NULL,
  `activationdate` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for таблиця nuance_new.street
CREATE TABLE IF NOT EXISTS `street` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `city` int(11) DEFAULT NULL COMMENT 'link',
  `name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for таблиця nuance_new.tariff
CREATE TABLE IF NOT EXISTS `tariff` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `price` int(11) DEFAULT NULL COMMENT 'money',
  `downspeed` varchar(10) CHARACTER SET latin1 DEFAULT NULL COMMENT 'speed',
  `upspeed` varchar(10) DEFAULT NULL COMMENT 'speed',
  `nightdownspeed` varchar(10) DEFAULT NULL COMMENT 'speed',
  `nightupspeed` varchar(10) DEFAULT NULL COMMENT 'speed',
  `downburstlimit` varchar(10) DEFAULT NULL COMMENT 'speed',
  `upburstlimit` varchar(10) DEFAULT NULL COMMENT 'speed',
  `downburstthreshold` varchar(10) DEFAULT NULL COMMENT 'speed',
  `upburstthreshold` varchar(10) DEFAULT NULL COMMENT 'speed',
  `downbursttime` varchar(10) DEFAULT NULL,
  `upbursttime` varchar(10) DEFAULT NULL,
  `city` tinytext COMMENT 'multilink',
  `public` tinyint(1) DEFAULT NULL,
  `comment` text COMMENT 'multitext',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for таблиця nuance_new.user
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `login` tinytext,
  `password` tinytext COMMENT 'generatepassword',
  `contractid` varchar(10) DEFAULT '',
  `sname` varchar(50) DEFAULT NULL,
  `fname` varchar(50) DEFAULT NULL,
  `pname` varchar(50) DEFAULT NULL,
  `phone` varchar(18) DEFAULT NULL COMMENT 'phone',
  `city` int(3) unsigned DEFAULT NULL COMMENT 'link',
  `street` int(3) unsigned DEFAULT NULL COMMENT 'link',
  `house` varchar(5) DEFAULT NULL,
  `flat` varchar(3) CHARACTER SET latin1 DEFAULT NULL,
  `tariff` int(3) unsigned DEFAULT NULL COMMENT 'tarifflink',
  `router` int(3) unsigned DEFAULT NULL COMMENT 'link',
  `cash` float(9,2) DEFAULT '0.00' COMMENT 'money',
  `discount` varchar(10) DEFAULT '0' COMMENT 'discount',
  `referrer` int(10) unsigned DEFAULT '0' COMMENT 'link-user',
  `regdate` timestamp NULL DEFAULT NULL COMMENT 'date',
  `editdate` timestamp NULL DEFAULT NULL,
  `disabled` tinyint(1) DEFAULT '0',
  `credit` tinyint(1) DEFAULT '0',
  `iplist` longtext COMMENT 'iplist',
  `comment` mediumtext COMMENT 'multitext',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

-- Dump completed on 2013-09-25 21:57:19
INSERT INTO `master` (`id`, `login`, `password`, `group`) VALUES (1, 'demo', 'fe01ce2a7fbac8fafaed7c982a04e229', 1); 
INSERT INTO `group` (`id`, `name`, `acl`) VALUES (1, 'Administrator', '{"table":true,"preference":true,"statistics":true,"tools":true}'), (2, 'Operator', '{"table":{"order":{"read":true},"scratchcard":{"read":true},"user":true,"moneyflow":true,"tariff":{"read":true},"city":{"read":true,"edit":true,"add":true},"street":{"read":true,"edit":true,"add":true},"router":{"read":true},"master":{"read":{"login":true}}},"statistics":true,"tools":true}'),	(3, 'Installer', '{"table":{"order":{"read":true},"user":{},"moneyflow":{"read":true,"add":true},"tariff":{"read":true},"city":{"read":true},"street":{"read":true},"router":{"read":{"name":true,"routertype":true}},"master":{"read":{"login":true}},"group":{"read":{"name":true}}}}'),	(4, 'Cashier', '{"table":{"order":{"read":true},"scratchcard":{"read":true},"user":{"read":true},"moneyflow":{"read":true,"edit":true,"add":true},"tariff":{"read":true},"city":{"read":true},"street":{"read":true},"router":{"read":{"name":true,"routertype":true}},"master":{"read":{"login":true}}},"statistics":true}');  
