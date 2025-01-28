const details = [
  {
    id: "1",
    CUSTOMER: "James Onuoha",
    AMOUNT: "N258,936",
    TYPE: "Repayment",
    PROPERTY: "no 23 joseph waku street",
    PLAN: "family plan",
    PAYMENT_DUEDATE: "4th october 2023",
  },
  {
    id: "2",
    CUSTOMER: "Ngutor okpahindi",
    AMOUNT: "369,000",
    TYPE: "Repayment",
    PROPERTY: "no 23 joseph waku street",
    PLAN: "diaspora",
    PAYMENT_DUEDATE: "4th october 2023",
  },
  {
    id: "3",
    CUSTOMER: "uche peter",
    AMOUNT: "369,000",
    TYPE: "Repayment",
    PROPERTY: "no 23 joseph waku street",
    PLAN: "diaspora",
    PAYMENT_DUEDATE: "4th october 2023",
  },
  {
    id: "4",
    CUSTOMER: "michael jonah",
    AMOUNT: "369,000",
    TYPE: "Repayment",
    PROPERTY: "no 23 joseph waku street",
    PLAN: "diaspora",
    PAYMENT_DUEDATE: "4th october 2023",
  },
  {
    id: "5",
    CUSTOMER: "magnus okonkwo",
    AMOUNT: "369,000",
    TYPE: "Repayment",
    PROPERTY: "no 23 joseph waku street",
    PLAN: "diaspora",
    PAYMENT_DUEDATE: "4th october 2023",
  },
];

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DropdownMenu from "../../components/dropdownMenu";

export default function ResponsiveTable() {
  const [data, setData] = useState([]);
  const url = "https://restcountries.com/v3.1/independent?status=true";

  const fetchData = async () => {
    try {
      const response = await axios.get(url);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="overflow-x-auto">
      <BoxWrapper>
        <table className="min-w-full divide-y divide-gray-200 table-auto ">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ width: "10%" }}
              >
                ID
              </th>
              <th
                scope="col"
                className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ width: "15%" }}
              >
                CUSTOMER
              </th>
              <th
                scope="col"
                className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ width: "10%" }}
              >
                AMOUNT
              </th>
              <th
                scope="col"
                className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ width: "10%" }}
              >
                TYPE
              </th>
              <th
                scope="col"
                className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ width: "15%" }}
              >
                PROPERTY
              </th>
              <th
                scope="col"
                className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ width: "15%" }}
              >
                PLAN
              </th>
              <th
                scope="col"
                className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ width: "15%" }}
              >
                PAYMENT_DUEDATE
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {details.map((item, index) => (
              <tr key={index} className="">
                <td className="py-4 px-2 whitespace-nowrap">{item.id}</td>
                <td className="py-4 px-2 whitespace-nowrap">{item.CUSTOMER}</td>
                <td className="py-4 px-2 whitespace-nowrap">{item.AMOUNT}</td>
                <td className="py-4 px-2 whitespace-nowrap">{item.TYPE}</td>
                <td className="py-4 px-2 whitespace-nowrap">{item.PROPERTY}</td>
                <td className="py-4 px-2 whitespace-nowrap">{item.PLAN}</td>
                <td className="py-4 px- whitespace-nowrap">
                  {item.PAYMENT_DUEDATE}
                </td>
                <td className="">
                  <DropdownMenu />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </BoxWrapper>
    </div>
  );
}

function BoxWrapper({ children }) {
  return (
    <div className="border-x border-gray-200 rounded-sm mt-3 ">{children}</div>
  );
}
