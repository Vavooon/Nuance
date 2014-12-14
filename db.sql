-- MySQL dump 10.14  Distrib 5.5.31-MariaDB, for Win64 (x86)
--
-- Host: localhost    Database: nuance
-- ------------------------------------------------------
-- Server version	5.5.31-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `nuance`
--

/*!40000 DROP DATABASE IF EXISTS `nuance`*/;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `nuance` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `nuance`;

--
-- Table structure for table `city`
--

DROP TABLE IF EXISTS `city`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `city` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(15) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `config`
--

DROP TABLE IF EXISTS `config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `config` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(50) DEFAULT NULL,
  `ownerid` int(11) DEFAULT NULL,
  `path` varchar(50) DEFAULT NULL,
  `vartype` varchar(50) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `value` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `group`
--

DROP TABLE IF EXISTS `group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `group` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` tinytext,
  `acl` text COMMENT 'acl',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `log`
--

DROP TABLE IF EXISTS `log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `log` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` tinytext,
  `subtype` tinytext,
  `master` int(10) unsigned DEFAULT NULL,
  `action` tinytext,
  `targetsection` tinytext,
  `targetid` int(10) unsigned DEFAULT NULL,
  `olddata` tinytext,
  `newdata` tinytext,
  `date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `master`
--

DROP TABLE IF EXISTS `master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `master` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `login` varchar(60) CHARACTER SET latin1 DEFAULT NULL,
  `password` varchar(64) CHARACTER SET latin1 DEFAULT NULL COMMENT 'md5password',
  `group` int(11) unsigned DEFAULT NULL COMMENT 'link',
  `disabled` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `message` (
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `moneyflow`
--

DROP TABLE IF EXISTS `moneyflow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `moneyflow` (
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order` (
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `router`
--

DROP TABLE IF EXISTS `router`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `router` (
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `routerupdatequeue`
--

DROP TABLE IF EXISTS `routerupdatequeue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `routerupdatequeue` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `router` int(10) unsigned DEFAULT '0',
  `mode` varchar(50) DEFAULT NULL,
  `user` int(10) unsigned DEFAULT '0',
  `fff` int(10) unsigned DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `scratchcard`
--

DROP TABLE IF EXISTS `scratchcard`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `scratchcard` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `code` char(16) DEFAULT NULL,
  `value` int(10) unsigned DEFAULT NULL COMMENT 'money',
  `user` int(10) unsigned DEFAULT NULL COMMENT 'link',
  `activated` tinyint(1) DEFAULT NULL,
  `activationdate` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `street`
--

DROP TABLE IF EXISTS `street`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `street` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `city` int(11) DEFAULT NULL COMMENT 'link',
  `name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tariff`
--

DROP TABLE IF EXISTS `tariff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tariff` (
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
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
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2013-09-25 21:57:19
INSERT INTO `master` (`id`, `login`, `password`, `group`) VALUES (1, 'demo', 'fe01ce2a7fbac8fafaed7c982a04e229', 1); 
INSERT INTO `group` (`id`, `name`, `acl`) VALUES (1, 'Administrator', '{"table":true,"preference":true,"statistics":true,"tools":true}'), (2, 'Operator', '{"table":{"order":{"read":true},"scratchcard":{"read":true},"user":true,"moneyflow":true,"tariff":{"read":true},"city":{"read":true,"edit":true,"add":true},"street":{"read":true,"edit":true,"add":true},"router":{"read":true},"master":{"read":{"login":true}}},"statistics":true,"tools":true}'),	(3, 'Installer', '{"table":{"order":{"read":true},"user":{},"moneyflow":{"read":true,"add":true},"tariff":{"read":true},"city":{"read":true},"street":{"read":true},"router":{"read":{"name":true,"routertype":true}},"master":{"read":{"login":true}},"group":{"read":{"name":true}}}}'),	(4, 'Cashier', '{"table":{"order":{"read":true},"scratchcard":{"read":true},"user":{"read":true},"moneyflow":{"read":true,"edit":true,"add":true},"tariff":{"read":true},"city":{"read":true},"street":{"read":true},"router":{"read":{"name":true,"routertype":true}},"master":{"read":{"login":true}}},"statistics":true}');  
