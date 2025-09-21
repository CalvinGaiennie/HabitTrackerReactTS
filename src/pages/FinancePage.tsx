// import { useEffect, useState } from "react";
// import { createLinkToken, exchangePublicToken, getTransactions } from "../services/api";

// function FinancePage() {
//   const [linkToken, setLinkToken] = useState<string | null>(null);
//   const [transactions, setTransactions] = useState<any[]>([]);

//   // Get link token from backend
//   useEffect(() => {
//     createLinkToken().then((data) => setLinkToken(data.link_token));
//   }, []);

//   // Open Plaid Link flow
//   const openPlaid = () => {
//     if (!linkToken) return;

//     const handler = (window as any).Plaid.create({
//       token: linkToken,
//       onSuccess: (public_token: string) => {
//         exchangePublicToken(public_token).then(() => {
//           getTransactions().then(setTransactions);
//         });
//       },
//       onExit: (err: any, metadata: any) => {
//         if (err) {
//           console.error("Plaid exited with error:", err);
//         } else {
//           console.log("Plaid exited:", metadata);
//         }
//       },
//     });

//     handler.open();
//   };

//   if (!linkToken) {
//     return <p>Loading Plaid...</p>;
//   }

//   return (
//     <div className="container d-flex flex-column align-items-center">
//       <h1>Finance Page</h1>
//       <button onClick={openPlaid}>Connect Bank</button>
//       <ul>
//         {transactions.map((txn) => (
//           <li key={txn.transaction_id}>
//             {txn.date} - {txn.name} - ${txn.amount}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default FinancePage;
