"use client"


import {useRef} from "react";
import Image from "next/image";
import Textarea from "./components/textarea";
import Button from "./components/button";
import Password from "./components/password"

export default function Home() {
  const txref = useRef(null);
  const pwref = useRef(null);
  return (
      <div> 
        <div>
          <Textarea txref={txref}/>
        </div>
        <div>
          <Password pwref={pwref}/>
        </div>
        <div>
          <Button target={txref} password={pwref}/>
        </div>
      </div>
  );
}
