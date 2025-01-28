// export default authApi;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { store } from "../../store";
import backendURL from "../../config";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: backendURL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.userToken;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (build) => ({
    loginUser: build.mutation({
      query: (credentials) => ({
        url: "account/login",
        method: "POST",
        body: credentials,
      }),
    }),
    getUserDetails: build.query({
      query: () => ({
        url: "api/user/profile",
        method: "GET",
      }),
    }),
  }),
});

export const { useLoginUserMutation, useGetUserDetailsQuery } = authApi;

export default authApi;
