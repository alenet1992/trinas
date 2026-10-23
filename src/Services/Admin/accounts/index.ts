import Cookies from "js-cookie";
import type { CompanyAccountModel } from "@/model/CompanyAccount";

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${Cookies.get('token')}`
});


export const get_company_accounts = async () => {
  try {
    const res = await fetch('/api/Admin/accounts', { method: 'GET', headers: authHeaders() });
    return await res.json();
  } catch (error) {
    console.log('Error in getting company accounts (service) =>', error)
  }
}


export const get_company_account_password = async (id: string) => {
  try {
    const res = await fetch(`/api/Admin/accounts?id=${id}`, { method: 'GET', headers: authHeaders() });
    return await res.json();
  } catch (error) {
    console.log('Error in getting company account password (service) =>', error)
  }
}


export const save_company_account = async (account: CompanyAccountModel) => {
  try {
    const res = await fetch('/api/Admin/accounts', {
      method: account._id ? 'PUT' : 'POST',
      headers: authHeaders(),
      body: JSON.stringify(account),
    });
    return await res.json();
  } catch (error) {
    console.log('Error in saving company account (service) =>', error)
  }
}


export const delete_company_account = async (id: string) => {
  try {
    const res = await fetch(`/api/Admin/accounts?id=${id}`, { method: 'DELETE', headers: authHeaders() });
    return await res.json();
  } catch (error) {
    console.log('Error in deleting company account (service) =>', error)
  }
}
