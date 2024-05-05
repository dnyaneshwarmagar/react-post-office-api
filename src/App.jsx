import { useState } from "react";
import Loader from "./Loader";
import "./App.css";

function App() {
  const [pincode, setPincode] = useState("");
  const [data, setData] = useState(null);
  const [permData, setPermData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [show, setShow] = useState(true);

  async function handleSubmit(e) {
    setLoading(true);
    e.preventDefault();
    if (pincode.length < 6) {
      console.log(data);
      setError(true);
      setErrorMsg("Provide valid 6 digit Pincode");
      setLoading(false);
      return;
    }
    try {
      let response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      console.log("pincode:", pincode);
      let data = await response.json();
      data = data[0];
      if (data.Status === "Success") {
        setData(data.PostOffice);
        setPermData(data.PostOffice);
        setShow(false);
      } else {
        console.log(data);
        setError(true);
        setErrorMsg(`Provide correct Pincode, ${data.Message}`);
      }
      setLoading(false);
      console.log("data:", data);
    } catch (error) {
      console.log(error);
      setError(true);
      setErrorMsg("Something went wrong, please try again!");
      setLoading(false);
    }
  }

  function handleFilter(char) {
    let data = permData.filter((post) =>
      post.Name.toLowerCase().includes(char.toLowerCase())
    );
    setData(data);
  }
  return (
    <>
      {show ? (
        <form onSubmit={(e) => handleSubmit(e)}>
          <h1>Enter Pincode</h1>
          <input
            type="number"
            placeholder="Pincode"
            value={pincode}
            onChange={(e) => {
              setPincode(e.target.value);
              console.log(pincode);
            }}
          />
          <button type="submit">Lookup</button>
          {error ? <p style={{ color: "red",fontSize:"24px" }}>{errorMsg}</p> : ""}
          {loading ? <Loader /> : ""}
        </form>
      ) : (
        <div className="data_box">
          <div className="info_div">
            <p>
              <b>
                Pincode: <span>{pincode}</span>
              </b>
            </p>
            <p>
              <b>Message:</b>{" "}
              <span>Number of Pincode(s) Found: {data.length}</span>
            </p>
          </div>
          <div className="fileter_div">
            <input
              placeholder="Filter"
              onChange={(e) => handleFilter(e.target.value)}
            />
          </div>
          <div className="cards_div">
            {data.length
              ? data.map((post, index) => (
                  <div key={index}>
                    <p>
                      Name: <span>{post.Name}</span>
                    </p>
                    <p>
                      Branch Type: <span>{post.BranchType}</span>
                    </p>
                    <p>
                      Delivery Status: <span>{post.DeliveryStatus}</span>
                    </p>
                    <p>
                      District: <span>{post.District}</span>
                    </p>
                    <p>
                      Division: <span>{post.Division}</span>
                    </p>
                  </div>
                ))
              : "Couldn’t find the postal data you’re looking for…"}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
