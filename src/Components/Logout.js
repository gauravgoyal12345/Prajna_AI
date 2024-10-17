// import RoundedButton from "./RoundedButton";
import RoundedButton2 from "./RoundedButton2";
import { useState } from "react";
import { Popconfirm} from "antd";  // Import from antd
import { useNavigate } from "react-router-dom"; 


function LogOut(){
    const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [description, setDescription] = useState("Are you sure you want to LogOut");
  const showPopconfirm = () => {
    setOpen(true);
    
  };

  const handleOk = () => {
    setConfirmLoading(true);
    localStorage.removeItem("userDetails");
    setDescription("User Successfully Logged Out!")
    setTimeout(() => {
        navigate('/');      
        window.location.reload();     
    }, 1000);  // Delay for a smooth transition
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };

  return (
    <Popconfirm
      title="LogOut Confirm"
      description={description}
      open={open}
      onConfirm={handleOk}
      okButtonProps={{
        loading: confirmLoading,
      }}
      onCancel={handleCancel}
    >

      <RoundedButton2 label = "LogOut" onClick={showPopconfirm}></RoundedButton2>
    </Popconfirm>
  );
};

export default LogOut;
