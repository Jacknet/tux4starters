--
-- Tux For Starters
-- MariaDB/MySQL DDL query script
--

--
-- Create the "users" table,
-- dropping any that already exist
--

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `username` varchar(15) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` binary(60) NOT NULL,
  `sessionId` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Create the "genUnix" lessons module table,
-- dropping any that already exist
--

DROP TABLE IF EXISTS `genUnix`;

CREATE TABLE `genUnix` (
  `lessonName` varchar(60) DEFAULT NULL,
  `username` varchar(60) DEFAULT NULL,
  `multiStarRating` int(11) DEFAULT NULL,
  `termStarRating` int(11) DEFAULT NULL,
  `completed` varchar(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Create the "basicCommands" lessons module table,
-- dropping any that already exist
--
DROP TABLE IF EXISTS `basicCommands`;

CREATE TABLE `basicCommands` (
  `lessonName` varchar(60) DEFAULT NULL,
  `username` varchar(60) DEFAULT NULL,
  `multiStarRating` int(11) DEFAULT NULL,
  `termStarRating` int(11) DEFAULT NULL,
  `completed` varchar(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
