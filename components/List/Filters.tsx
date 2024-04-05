/**************************************************************************************************************/
/* Author: Jalon Kimes                                                                                        */
/* This file contains the filtering functions for the card list                                               */
/**************************************************************************************************************/
export const filterByShowAll = async (collectionRef: any) => {
  return collectionRef;
};

export const filterByActive = async (collectionRef: any) => {
  return collectionRef.filter((item) => item.Active === true);
};

export const filterByInactive = async (collectionRef: any) => {
  return collectionRef.filter((item) => item.Active === false);
};
