// here is component
import React, { useEffect, useState } from "react";
import Loading from "../../../components/Loading/Loading";
import {
  useGetLoginUserQuery,
  useLevelTeamListQuery,
} from "../../../Services/userApi";

const MyTree = () => {
  const { isLoading } = useLevelTeamListQuery();
  const { data: mySelf } = useGetLoginUserQuery();   
  // myself  has a data like, 
  // {
  //   user_id: 83743774,
  //   name: "khalid",
  //   email: "email"
  //   // etc etc
  // }

  const [treeDataArray, setTreeDataArray] = useState([]);

  const treeRendering = (treeDataArray) => {
    return (
      <ul>
        {treeDataArray?.map((item) => (
          <li key={item?.user_id}>
            <div style={{ fontWeight: "bold" }} id={item?.user_id}>
              {item.name}
              {/* {item?.user_id} */}
            </div>
            {item?.mySponsorTree &&
              item?.mySponsorTree?.length &&
              treeRendering(item?.mySponsorTree)}
          </li>
        ))}
      </ul>
    );
  };

  const fetchData = async (id) => {
    const res = await fetch(`http://localhost:5000/public/api/mytree/${id}`);
    const data = await res.json();

    
    // data?looks like,
    //   {
    //     success: true,
    //     mySponsorTree:{
    //       user_id,
    //       name,
    //       position: "left/right",
    //       mySponsorTree:[
    //           {
    //           user_id,
    //           name,
    //           position,
    //           },
    //           {
    //           user_id,
    //           name,
    //           position,
    //           }
    //       ]
    //     }
    //   }

    
    return data?.mySponsorTree?.mySponsorTree;
  };

  const buildNestedArray = async (id) => {
    const childrenData = await fetchData(id);

    if (!childrenData || childrenData?.length === 0) {
      return null; // No more children, end of recursion
    }

    const nestedArray = await Promise.all(
      childrenData?.map(async (child) => {
        const grandchildren = await buildNestedArray(child?.user_id);

        return { ...child, ...grandchildren };
      })
    );
    return {
      name: mySelf?.data?.name,
      user_id: mySelf?.data?.user_id,
      ...childrenData,
      mySponsorTree: nestedArray,
    };
  };
  async function generateTreeData() {
    buildNestedArray(mySelf?.data?.user_id).then((nestedArray) => {
      setTreeDataArray([nestedArray]);
    });
  }

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="tree">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            alignItems: "center",
            text: "center",
            border: "2px solid black",
            borderRadius: "10px",
            padding: " 4px 10px",
          }}
          onClick={generateTreeData}
        >
          Show my tree
        </p>
      </div>

      {treeDataArray && treeRendering(treeDataArray)}
    </div>
  );
};

export default MyTree;




// here is css

.tree ul {
  padding-top: 20px; position: relative;
  
  transition: all 0.5s;
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
}

.tree li {
  float: left; text-align: center;
  list-style-type: none;
  position: relative;
  padding: 20px 5px 0 5px;
  
  transition: all 0.5s;
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
}

.tree li::before, .tree li::after{
  content: '';
  position: absolute; top: 10px; right: 50%;
  border-top: 1px solid #ccc;
  width: 50%; height: 10px;
}
.tree li::after{
  right: auto; left: 50%;
  border-left: 1px solid #ccc;

}

.tree li:only-child::after, .tree li:only-child::before {
  display: none;
}

.tree li:only-child{ padding-top: 18px;}

.tree li:first-child::before, .tree li:last-child::after{
  border: 0 none;
}
.tree li:last-child::before{
  border-right: 1px solid #ccc;
  border-radius: 0 5px 0 0;
  -webkit-border-radius: 0 5px 0 0;
  -moz-border-radius: 0 5px 0 0;
}
.tree li:first-child::after{
  border-radius: 5px 0 0 0;
  -webkit-border-radius: 5px 0 0 0;
  -moz-border-radius: 5px 0 0 0;
}
.tree ul ul::before{
  content: '';
  position: absolute; top: 0; left: 50%;
  border-left: 2px solid #ccc;
  width: 0; height: 10px;
}
.tree li div{
  border: 2px solid #ccc;
  padding: 5px 60px;
  text-decoration: none;
  color: #666;
  font-family: arial, verdana, tahoma;
  font-size: 11px;
  display: inline-block;
  
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  
  transition: all 0.5s;
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
}
.tree li div:hover, .tree li div:hover+ul li div {
  background: #c8e4f8; color: #000; border: 2px solid #94a0b4;
}
.tree li div:hover+ul li::after, 
.tree li div:hover+ul li::before, 
.tree li div:hover+ul::before, 
.tree li div:hover+ul ul::before{
  border-color:  #94a0b4;
}
