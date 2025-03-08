import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@rneui/themed';
import { AuthProvider } from '../components/ContextGetters/AuthContext'; // Adjust the import path
import { CustomerExpContext } from '../components/ContextGetters/CustomerExpContext';
import { PaymentContext } from '../components/ContextGetters/PaymentContext';
import { VendorsContext } from '../components/ContextGetters/VendorsContext';
import { DataContext } from '../components/ContextGetters/DataContext';
import { QuoteContext } from '../components/ContextGetters/QuoteContext';
import { WipContext } from '../components/ContextGetters/WipContext';
import { Expense, Payment, Vendor, Client, Quote, LineItem } from '../App';
import { firebase } from "../config";

type DocumentData<T> = T & { id: string };
export interface Contact {
  email: string;
  name: string;
  street: string;
  city: string;
  zip: string;
  phone: number;
}

const Providers = ({ children }: { children: React.ReactNode }) => {
    const [exp, setExp] = useState<Expense[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [data, setData] = useState<Client[]>([]);
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [filteredData, setFilteredData] = useState<Client[]>([]);
    const [wip, setWip] = useState<Client[]>([]);
    const collectionRef = firebase.firestore().collection("clients");
    const quotesRef = firebase.firestore().collection("Quotes");
    const vendorsRef = firebase.firestore().collection("vendors");
    const wipRef = firebase.firestore().collection("wip");
    const paymentRef = firebase.firestore().collection("test");
    const expenseRef = firebase.firestore().collection("customerExp");

    const fetchPayments = async () => {
        const snapshot = await paymentRef.get();
        if (snapshot.empty) {
          console.log("No matching results!");
        } else {
          const newData: Payment[] = snapshot.docs.map((doc) => ({
            ...doc.data() as Payment,
            id: doc.id,
          }));
          setPayments(newData); // Update state with fetched data
        }
      };
    
      const fetchWip = async () => {
        const snapshot = await wipRef.get();
        if (snapshot.empty) {
          console.log("No matching results!");
        } else {
          const newData: Client[] = snapshot.docs.map((doc) => ({
            ...(doc.data() as Client),
            id: doc.id,
            
          }));
          setWip(newData); // Update state with fetched data
        }
      };
    
      const fetchQuotes = async () => {
        try {
          const quotesRef = firebase.firestore().collection("Quotes");
          const snapshot = await quotesRef.get();
          const fetchedQuotes: DocumentData<Quote>[] = [];
    
          snapshot.forEach(async (doc) => {
            const quoteData = doc.data() as Quote;
            const lineItemsRef = quotesRef.doc(doc.id).collection("LineItems");
            const lineItemsSnapshot = await lineItemsRef.get();
            const lineItems = lineItemsSnapshot.docs.map((lineItemDoc) => ({
              ...(lineItemDoc.data() as LineItem),
              id: lineItemDoc.id,
              
            }));
    
            const quoteWithLineItems = {
              ...quoteData,
              id: doc.id,
              lineItems,
            };
    
            fetchedQuotes.push(quoteWithLineItems);
          });
    
          setQuotes(fetchedQuotes);
        } catch (error) {
          console.error("Error fetching quotes:", error);
        }
      };
    
      const fetchData = async () => {
        const snapshot = await collectionRef.orderBy("ClientName").get();
        if (snapshot.empty) {
          console.log("No matching results!");
        } else {
          const newData: DocumentData<Client>[] = snapshot.docs.map((doc) => ({
            ...(doc.data() as Client),
            id: doc.id,
            
          }));
          setData(newData); // Update state with fetched data
          setFilteredData(newData); // Initialize filteredData with fetched data
        }
      };

    useEffect(() => {
        // Fetch initial data when component mounts
        fetchData();
        fetchQuotes();
        fetchWip();
        fetchPayments();
    
        // Set up Firestore listener for vendors collection
        const unsubscribeExpenses = expenseRef
          .orderBy("VendorNumber")
          .onSnapshot((snapshot) => {
            const newData = snapshot.docs.map((doc) => ({
              ...doc.data() as Expense,
              id: doc.id,
            }));
            setExp(newData);
          });
    
        // Set up Firestore listener for clients collection
        const unsubscribeWip = wipRef.orderBy("name").onSnapshot((snapshot) => {
          const newData: Client[] = snapshot.docs.map((doc) => ({
            ...(doc.data() as Omit<Client, 'id'>),
            id: doc.id,
          }));
          setWip(newData);
        });
    
        // Set up Firestore listener for vendors collection
        const unsubscribeVendors = vendorsRef.onSnapshot((snapshot) => {
          const newData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Vendor[];
          setVendors(newData);
        });
    
        // Set up Firestore listener for vendors collection
        const unsubscribePayments = paymentRef
          .orderBy("CustomerNum")
          .orderBy("Date", "desc")
          .onSnapshot((snapshot) => {
            const newData: Payment[] = snapshot.docs.map((doc) => ({
              ...doc.data() as Payment,
              id: doc.id,
            }));
            setPayments(newData);
          });
    
        // Set up Firestore listener for clients collection
        const unsubscribeClients = collectionRef
          .orderBy("ClientName")
          .onSnapshot((snapshot) => {
            const newData: Client[] = snapshot.docs.map((doc) => ({
              ...(doc.data() as Omit<Client, 'id'>),
              id: doc.id,
            }));
            setData(newData);
            setFilteredData(newData);
          });
    
        // Set up Firestore listener for quotes collection
        const unsubscribeQuotes = quotesRef.onSnapshot((snapshot) => {
          const fetchedQuotes: any[] = [];
    
          snapshot.forEach(async (doc) => {
            const quoteData = doc.data();
            const lineItemsRef = quotesRef.doc(doc.id).collection("LineItems");
            const lineItemsSnapshot = await lineItemsRef.get();
            const lineItems = lineItemsSnapshot.docs.map((lineItemDoc) => {
              const data = lineItemDoc.data() as Omit<LineItem, 'id'>;
              return {
                ...data,
                id: lineItemDoc.id,
              };
            });
    
            const quoteWithLineItems = {
              id: doc.id,
              ...quoteData,
              lineItems,
            };
    
            fetchedQuotes.push(quoteWithLineItems);
          });
    
          setQuotes(fetchedQuotes);
        });
    
        return () => {
          // Clean up listeners
          unsubscribeClients();
          unsubscribeQuotes();
          unsubscribeWip();
          unsubscribeVendors();
          unsubscribePayments();
          unsubscribeExpenses();
        };
      }, []);

      

  return (
    <AuthProvider>
      <ThemeProvider>
        <CustomerExpContext.Provider value={ exp}>
          <PaymentContext.Provider value={payments}>
            <VendorsContext.Provider value={vendors}>
              <DataContext.Provider value={data}>
                <QuoteContext.Provider value={quotes}>
                  <WipContext.Provider value={wip}>
                    {children}
                  </WipContext.Provider>
                </QuoteContext.Provider>
              </DataContext.Provider>
            </VendorsContext.Provider>
          </PaymentContext.Provider>
        </CustomerExpContext.Provider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default Providers;
