/**************************************************************************************************************/
/* Author: Jalon Kimes                                                                                        */
/* This file contains the filtering functions for the card list                                               */
/**************************************************************************************************************/
export const filterByShowAll = async (collectionRef: any) => {
  return collectionRef;
};

export const filterByActive = async (collectionRef: any) => {
  return collectionRef.filter((item) => item.Active === "A");
};

export const filterByInactive = async (collectionRef: any) => {
  return collectionRef.filter((item) => item.Active === "I");
};

export const filterBySubcontractors = async (collectionRef: any) => {
  return collectionRef.filter((item) => item.Type === "S");
};

export const filterByProfessional = async (collectionRef: any) => {
  return collectionRef.filter((item) => item.Type === "P");
};

export const filterByMaterials = async (collectionRef: any) => {
  return collectionRef.filter((item) => item.Type === "M");
};
export const filterByEquipment = async (collectionRef: any) => {
  //console.log(JSON.stringify(collectionRef.filter((item) => item.Type === "E")));
  return collectionRef.filter((item) => item.Type === "E");
};

export const filterAllTypes = async (collectionRef: any) => {
  return collectionRef;
};

export const filterByGVT = async (collectionRef: any) => {
  return collectionRef.filter((item) => item.Type === "G");
};
