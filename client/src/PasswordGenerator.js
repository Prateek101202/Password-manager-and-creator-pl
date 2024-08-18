import React, { useState, useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./PasswordGenerator.css";

function PasswordGenerator() {
  const [length, setLength] = useState(8);
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [charAllowed, setCharAllowed] = useState(false);
  const [password, setPassword] = useState("");

  const passwordRef = useRef(null);

  const passwordGenerator = useCallback(() => {
    let i=0;
    const BOLD="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const sm = "abcdefghijklmnopqrstuvwxyz"
    const sp="!@#$%^&*"
    const num="0123456789"
    let pass=""
      let stri=""
      if(charAllowed){

        stri= stri + sp
        i++
        pass = pass + sp.charAt(Math.floor(Math.random() *sp.length))

      }
      if(numberAllowed){

        stri = stri + num
        i++
        const char=num.charAt(Math.floor(Math.random() *num.length))
        pass = pass +char

      }
      // let stri = BOLD + sm + sp + num
      stri = stri + BOLD + sm
      for(;i<length;++i){
        pass = pass + stri.charAt(Math.floor(Math.random() * stri.length))
      }
      function shuffleString(string) {
        const array = string.split('');
        for (let j = array.length - 1; j > 0; j--) {
            const randomIndex = Math.floor(Math.random() * (j + 1));
            [array[j], array[randomIndex]] = [array[randomIndex], array[j]]; // Swap
        }
        return array.join('');
    }

    pass = shuffleString(pass)
      setPassword(pass)
  }, [length, numberAllowed, charAllowed]);

  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select();
    passwordRef.current?.setSelectionRange(0, 999);
    window.navigator.clipboard.writeText(password);
  }, [password]);

  useEffect(() => {
    passwordGenerator();
  }, [length, numberAllowed, charAllowed, passwordGenerator]);

  return (
    <div className="password-generator-container">
      <h1>Password Generator</h1>
      <div className="password-display">
        <input
          type="text"
          value={password}
          className="password-input"
          placeholder="Password"
          readOnly
          ref={passwordRef}
        />
        <button className="copy-button" onClick={copyPasswordToClipboard}>
          Copy
        </button>
      </div>
      <div className="options">
        <div className="length-option">
          <input
            type="range"
            min={8}
            max={40}
            value={length}
            onChange={(e) => setLength(e.target.value)}
          />
          <label>Length: {length}</label>
        </div>
        <div className="checkbox-option">
          <input
            type="checkbox"
            defaultChecked={numberAllowed}
            id="numberInput"
            onChange={() => setNumberAllowed((prev) => !prev)}
          />
          <label htmlFor="numberInput">Numbers</label>
        </div>
        <div className="checkbox-option">
          <input
            type="checkbox"
            defaultChecked={charAllowed}
            id="characterInput"
            onChange={() => setCharAllowed((prev) => !prev)}
          />
          <label htmlFor="characterInput">Characters</label>
        </div>
      </div>
      <Link to="/password-manager">
        <button className="back-button">Go to Main Page</button>
      </Link>
    </div>
  );
}

export default PasswordGenerator;
