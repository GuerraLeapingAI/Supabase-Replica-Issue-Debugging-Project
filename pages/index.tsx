import React, { useState } from "react";
import { SupabaseService } from "../supabase";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [mainData, setMainData] = useState<any[]>([]);
  const [replicaData, setReplicaData] = useState<any[]>([]);
  const [mainViewData, setMainViewData] = useState<any[]>([]);
  const [replicaViewData, setReplicaViewData] = useState<any[]>([]);

  const handleLogin = async () => {
    try {
      const session = await SupabaseService.login(email, password);
      if (session) {
        setLoggedIn(true);
        setError("");
        console.log("Login successful!");
      }
    } catch (e: any) {
      setError(e.message || "Login failed");
    }
  };

  const fetchMainData = async () => {
    const data = await SupabaseService.fetchDataFromMain();
    setMainData(data);
  };

  const fetchReplicaData = async () => {
    const data = await SupabaseService.fetchDataFromReplica();
    setReplicaData(data);
  };

  const fetchMainViewData = async () => {
    const data = await SupabaseService.fetchViewFromMain();
    setMainViewData(data);
  };

  const fetchReplicaViewData = async () => {
    const data = await SupabaseService.fetchViewFromReplica();
    setReplicaViewData(data);
  };

  const clearMainData = () => setMainData([]);
  const clearReplicaData = () => setReplicaData([]);
  const clearMainViewData = () => setMainViewData([]);
  const clearReplicaViewData = () => setReplicaViewData([]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Supabase Data Fetch Test</h1>

      {!loggedIn ? (
        <div>
          <h2>Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      ) : (
        <div>
          <h2>Data Fetch</h2>
          <button onClick={fetchMainData}>Fetch Main DB Data</button>
          <button onClick={fetchReplicaData}>Fetch Replica DB Data</button>
          <button onClick={fetchMainViewData}>Fetch Main DB View Data</button>
          <button onClick={fetchReplicaViewData}>Fetch Replica DB View Data</button>

          <h3>Main DB Data <button onClick={clearMainData}>Clear</button></h3>
          <pre>{JSON.stringify(mainData, null, 2)}</pre>

          <h3>Replica DB Data <button onClick={clearReplicaData}>Clear</button></h3>
          <pre>{JSON.stringify(replicaData, null, 2)}</pre>

          <h3>Main DB View Data <button onClick={clearMainViewData}>Clear</button></h3>
          <pre>{JSON.stringify(mainViewData, null, 2)}</pre>

          <h3>Replica DB View Data <button onClick={clearReplicaViewData}>Clear</button></h3>
          <pre>{JSON.stringify(replicaViewData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
