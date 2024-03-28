/**************************************************************************************************************/
/* Author: Jalon Kimes                                                                                        */
/* This file contains the filtering functions for the card list                                               */
/**************************************************************************************************************/
export const filterByShowAll = async (collectionRef: any) => {
  return collectionRef;
  // const snapshot = await collectionRef.get();
  // if (snapshot.empty) {
  //   console.log("No matching results!");
  //   return [];
  // } else {
  //   return snapshot.docs.map((doc) => ({
  //     id: doc.id,
  //     ...doc.data(),
  //   }));
  // }
};

export const filterByActive = async (collectionRef: any) => {
  return collectionRef.filter((item) => item.Active === true);
  // const activeData = await collectionRef.where("Active", "==", true).get();
  // if (activeData.empty) {
  //   console.log("No matching results!");
  //   return [];
  // } else {
  //   return activeData.docs.map((doc) => ({
  //     id: doc.id,
  //     ...doc.data(),
  //   }));
  // }
};

export const filterByInactive = async (collectionRef: any) => {
  return collectionRef.filter((item) => item.Active === false);
  // const incompleteData = await collectionRef.where("Active", "==", false).get();
  // // console.log("Show All: ", { incompleteData })
  // if (incompleteData.empty) {
  //   console.log("No matching results!");
  //   return [];
  // } else {
  //   return incompleteData.docs.map((doc) => ({
  //     id: doc.id,
  //     ...doc.data(),
  //   }));
  // }
};
