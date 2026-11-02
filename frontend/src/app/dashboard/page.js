"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, AlertTriangle, Box, Calendar, MapPin, RefreshCw, Loader2, ListFilter, ShieldAlert, HeartCrack } from "lucide-react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const indianStatesAndUTs = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", 
  "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", 
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const stateData = {
  "Andhra Pradesh": {
    cities: ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"],
    districts: ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"]
  },
  "Arunachal Pradesh": {
    cities: ["Anjaw", "Changlang", "Dibang Valley", "East Kameng", "East Siang", "Kra Daadi", "Kurung Kumey", "Lohit", "Longding", "Lower Dibang Valley", "Lower Siang", "Lower Subansiri", "Namsai", "Papum Pare", "Siang", "Tawang", "Tirap", "Upper Siang", "Upper Subansiri", "West Kameng", "West Siang"],
    districts: ["Anjaw", "Changlang", "Dibang Valley", "East Kameng", "East Siang", "Kra Daadi", "Kurung Kumey", "Lohit", "Longding", "Lower Dibang Valley", "Lower Siang", "Lower Subansiri", "Namsai", "Papum Pare", "Siang", "Tawang", "Tirap", "Upper Siang", "Upper Subansiri", "West Kameng", "West Siang"]
  },
  "Assam": {
    cities: ["Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tinsukia", "Udalguri", "West Karbi Anglong"],
    districts: ["Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tinsukia", "Udalguri", "West Karbi Anglong"]
  },
  "Bihar": {
    cities: ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran (Motihari)", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur (Bhabua)", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger (Monghyr)", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia (Purnea)", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"],
    districts: ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran (Motihari)", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur (Bhabua)", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger (Monghyr)", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia (Purnea)", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"]
  },
  "Chhattisgarh": {
    cities: ["Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur", "Dantewada (South Bastar)", "Dhamtari", "Durg", "Gariyaband", "Janjgir-Champa", "Jashpur", "Kabirdham (Kawardha)", "Kanker (North Bastar)", "Kondagaon", "Korba", "Korea (Koriya)", "Mahasamund", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sukma", "Surajpur", "Surguja"],
    districts: ["Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur", "Dantewada (South Bastar)", "Dhamtari", "Durg", "Gariyaband", "Janjgir-Champa", "Jashpur", "Kabirdham (Kawardha)", "Kanker (North Bastar)", "Kondagaon", "Korba", "Korea (Koriya)", "Mahasamund", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sukma", "Surajpur  ", "Surguja"]
  },
  "Goa": {
    cities: ["North Goa", "South Goa"],
    districts: ["North Goa", "South Goa"]
  },
  "Gujarat": {
    cities: ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha (Palanpur)", "Bharuch", "Bhavnagar", "Botad", "Chhota Udepur", "Dahod", "Dangs (Ahwa)", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kachchh", "Kheda (Nadiad)", "Mahisagar", "Mehsana", "Morbi", "Narmada (Rajpipla)", "Navsari", "Panchmahal (Godhra)", "Patan", "Porbandar", "Rajkot", "Sabarkantha (Himmatnagar)", "Surat", "Surendranagar", "Tapi (Vyara)", "Vadodara", "Valsad"],
    districts: ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha (Palanpur)", "Bharuch", "Bhavnagar", "Botad", "Chhota Udepur", "Dahod", "Dangs (Ahwa)", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kachchh", "Kheda (Nadiad)", "Mahisagar", "Mehsana", "Morbi", "Narmada (Rajpipla)", "Navsari", "Panchmahal (Godhra)", "Patan", "Porbandar", "Rajkot", "Sabarkantha (Himmatnagar)", "Surat", "Surendranagar", "Tapi (Vyara)", "Vadodara", "Valsad"]
  },
  "Haryana": {
    cities: ["Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurgaon", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Mewat", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"],
    districts: ["Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurgaon", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Mewat", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"]
  },
  "Himachal Pradesh": {
    cities: ["Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul &amp; Spiti", "Mandi", "Shimla", "Sirmaur (Sirmour)", "Solan", "Una"],
    districts: ["Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul &amp; Spiti", "Mandi", "Shimla", "Sirmaur (Sirmour)", "Solan", "Una"]
  },
  "Jharkhand": {
    cities: ["Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribag", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahibganj", "Seraikela-Kharsawan", "Simdega", "West Singhbhum"],
    districts: ["Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribag", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahibganj", "Seraikela-Kharsawan", "Simdega", "West Singhbhum"]
  },
  "Karnataka": {
    cities: ["Bagalkot", "Ballari (Bellary)", "Belagavi (Belgaum)", "Bengaluru (Bangalore)", "Bidar", "Chamarajanagar", "Chikballapur", "Chikkamagaluru (Chikmagalur)", "Chitradurga", "Dakshina Kannada", "Davangere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi (Gulbarga)", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru (Mysore)", "Raichur", "Ramanagara", "Shivamogga (Shimoga)", "Tumakuru (Tumkur)", "Udupi", "Uttara Kannada (Karwar)", "Vijayapura (Bijapur)", "Yadgir"],
    districts: ["Bagalkot", "Ballari (Bellary)", "Belagavi (Belgaum)", "Bengaluru (Bangalore) Rural", "Bengaluru (Bangalore) Urban", "Bidar", "Chamarajanagar", "Chikballapur", "Chikkamagaluru (Chikmagalur)", "Chitradurga", "Dakshina Kannada", "Davangere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi (Gulbarga)", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru (Mysore)", "Raichur", "Ramanagara", "Shivamogga (Shimoga)", "Tumakuru (Tumkur)", "Udupi", "Uttara Kannada (Karwar)", "Vijayapura (Bijapur)", "Yadgir"]
  },
  "Kerala": {
    cities: ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"],
    districts: ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"]
  },
  "Madhya Pradesh": {
    cities: ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"],
    districts: ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"]
  },
  "Maharashtra": {
    cities: ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"],
    districts: ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"]
  },
  "Manipur": {
    cities: ["Bishnupur", "Chandel", "Churachandpur", "Imphal", "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"],
    districts: ["Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"]
  },
  "Meghalaya": {
    cities: ["East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "North Garo Hills", "Ri Bhoi", "South Garo Hills", "South Khasi Hills", "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"],
    districts: ["East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "North Garo Hills", "Ri Bhoi", "South Garo Hills", "South West Garo Hills ", "South West Khasi Hills", "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"]
  },
  "Mizoram": {
    cities: ["Aizawl", "Champhai", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Serchhip"],
    districts: ["Aizawl", "Champhai", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Serchhip"]
  },
  "Nagaland": {
    cities: ["Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Peren", "Phek", "Tuensang", "Wokha", "Zunheboto"],
    districts: ["Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Peren", "Phek", "Tuensang", "Wokha", "Zunheboto"]
  },
  "Odisha": {
    cities: ["Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghapur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar (Keonjhar)", "Khordha", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Sonepur", "Sundargarh"],
    districts: ["Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghapur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar (Keonjhar)", "Khordha", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Sonepur", "Sundargarh"]
  },
  "Punjab": {
    cities: ["Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Mansa", "Moga", "Muktsar", "Nawanshahr (Shahid Bhagat Singh Nagar)", "Pathankot", "Patiala", "Rupnagar", "Sahibzada Ajit Singh Nagar (Mohali)", "Sangrur", "Tarn Taran"],
    districts: ["Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Mansa", "Moga", "Muktsar", "Nawanshahr (Shahid Bhagat Singh Nagar)", "Pathankot", "Patiala", "Rupnagar", "Sahibzada Ajit Singh Nagar (Mohali)", "Sangrur", "Tarn Taran"]
  },
  "Rajasthan": {
    cities: ["Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"],
    districts: ["Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"]
  },
  "Sikkim": {
    cities: ["East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim"],
    districts: ["East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim"]
  },
  "Tamil Nadu": {
    cities: ["Ariyalur", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Salem", "Sivaganga", "Thanjavur", "Theni", "Thoothukudi (Tuticorin)", "Tiruchirappalli", "Tirunelveli", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"],
    districts: ["Ariyalur", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Salem", "Sivaganga", "Thanjavur", "Theni", "Thoothukudi (Tuticorin)", "Tiruchirappalli", "Tirunelveli", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"]
  },
  "Telangana": {
    cities: ["Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhoopalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Komaram Bheem Asifabad", "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak", "Medchal", "Nagarkurnool", "Nalgonda", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal (Rural)", "Warangal (Urban)", "Yadadri Bhuvanagiri"],
    districts: ["Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhoopalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Komaram Bheem Asifabad", "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak", "Medchal", "Nagarkurnool", "Nalgonda", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal (Rural)", "Warangal (Urban)", "Yadadri Bhuvanagiri"]
  },
  "Tripura": {
    cities: ["Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti", "West Tripura"],
    districts: ["Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti", "West Tripura"]
  },
  "Uttar Pradesh": {
    cities: ["Agra", "Aligarh", "Allahabad", "Ambedkar Nagar", "Amethi (Chatrapati Sahuji Mahraj Nagar)", "Amroha (J.P. Nagar)", "Auraiya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Faizabad", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur (Panchsheel Nagar)", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kanshiram Nagar (Kasganj)", "Kaushambi", "Kushinagar (Padrauna)", "Lakhimpur - Kheri", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "RaeBareli", "Rampur", "Saharanpur", "Sambhal (Bhim Nagar)", "Sant Kabir Nagar", "Shahjahanpur", "Shamali (Prabuddh Nagar)", "Shravasti", "Siddharth Nagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"],
    districts: ["Agra", "Aligarh", "Allahabad", "Ambedkar Nagar", "Amethi (Chatrapati Sahuji Mahraj Nagar)", "Amroha (J.P. Nagar)", "Auraiya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Faizabad", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur (Panchsheel Nagar)", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kanshiram Nagar (Kasganj)", "Kaushambi", "Kushinagar (Padrauna)", "Lakhimpur - Kheri", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "RaeBareli", "Rampur", "Saharanpur", "Sambhal (Bhim Nagar)", "Sant Kabir Nagar", "Shahjahanpur", "Shamali (Prabuddh Nagar)", "Shravasti", "Siddharth Nagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"]
  },
  "Uttarakhand": {
    cities: ["Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"],
    districts: ["Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"]
  },
  "West Bengal": {
    cities: ["Alipurduar", "Bankura", "Birbhum", "Burdwan (Bardhaman)", "Cooch Behar", "Dakshin Dinajpur (South Dinajpur)", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Medinipur (West Medinipur)", "Purba Medinipur (East Medinipur)", "Purulia", "South 24 Parganas", "Uttar Dinajpur (North Dinajpur)"],
    districts: ["Alipurduar", "Bankura", "Birbhum", "Burdwan (Bardhaman)", "Cooch Behar", "Dakshin Dinajpur (South Dinajpur)", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Medinipur (West Medinipur)", "Purba Medinipur (East Medinipur)", "Purulia", "South 24 Parganas", "Uttar Dinajpur (North Dinajpur)"]
  },
  "Andaman and Nicobar Islands": {
    cities: ["Port Blair", "Nicobar", "Middle Andaman"],
    districts: ["Nicobar", "North & Middle Andaman", "South Andaman"]
  },
  "Chandigarh": {
    cities: ["Chandigarh"],
    districts: ["Chandigarh"]
  },
  "Dadra and Nagar Haveli and Daman and Diu": {
    cities: ["Dadra & Nagar Haveli", "Daman", "Diu"],
    districts: ["Dadra & Nagar Haveli", "Daman", "Diu"]
  },
  "Delhi": {
    cities: ["Central Delhi", "East Delhi", "New Delhi", "North  Delhi", "North Delhi", "Shahdara", "South  Delhi", "South Delhi", "West Delhi"],
    districts: ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East  Delhi", "North West  Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West  Delhi", "West Delhi"]
  },
  "Jammu and Kashmir": {
    cities: ["Anantnag", "Bandipore", "Baramulla", "Budgam", "Doda", "Ganderbal", "Jammu", "Kargil", "Kathua", "Kishtwar", "Kulgam", "Kupwara", "Leh", "Poonch", "Pulwama", "Rajouri", "Ramban", "Reasi", "Samba", "Shopian", "Srinagar", "Udhampur"],
    districts: ["Anantnag", "Bandipore", "Baramulla", "Budgam", "Doda", "Ganderbal", "Jammu", "Kargil", "Kathua", "Kishtwar", "Kulgam", "Kupwara", "Leh", "Poonch", "Pulwama", "Rajouri", "Ramban", "Reasi", "Samba", "Shopian", "Srinagar", "Udhampur"]
  },
  "Ladakh": {
    cities: ["Kargil", "Leh"],
    districts: ["Kargil", "Leh"]
  },
  "Lakshadweep": {
    cities: ["Agatti", "Amini", "Androth", "Bithra", "Chethlath", "Kadmath", "Kalpeni", "Kavaratti", "Kilthan", "Minicoy"],
    districts: ["Agatti", "Amini", "Androth", "Bithra", "Chethlath", "Kadmath", "Kalpeni", "Kavaratti", "Kilthan", "Minicoy"]
  },
  "Puducherry": {
    cities: ["Karaikal", "Mahe", "Pondicherry", "Yanam"],
    districts: ["Karaikal", "Mahe", "Pondicherry", "Yanam"]
  }
};

const stateConstituencies = {
  "Andaman and Nicobar Islands": ["Andaman and Nicobar Islands"],
  "Andhra Pradesh": ["Amalapuram", "Anakapalli", "Anantapur", "Araku", "Bapatla", "Chittoor", "Eluru", "Guntur", "Hindupur", "Kadapa", "Kakinada", "Kurnool", "Machilipatnam", "Nandyal", "Narasapuram", "Narasaraopet", "Nellore", "Ongole", "Rajahmundry", "Rajampet", "Srikakulam", "Tirupati", "Vijayawada", "Visakhapatnam", "Vizianagaram"],
  "Arunachal Pradesh": ["Arunachal East", "Arunachal West"],
  "Assam": ["Autonomous District", "Barpeta", "Darrang-Udalguri", "Dhubri", "Dibrugarh", "Dilbrugarh", "Diphu", "Guwahati", "Jorhat", "Kaliabor", "Karimganj", "Kaziranga", "Kokrajhar", "Lakhimpur", "Mangaldoi", "Nagaon", "Nowgong", "Silchar", "Sonitpur", "Tezpur"],
  "Bihar": ["Araria", "Arrah", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Buxar", "Darbhanga", "Gaya", "Gopalganj", "Hajipur", "Jahanabad", "Jamui", "Jhanjharpur", "Karakat", "Katihar", "Khagaria", "Kishanganj", "Madhepura", "Madhubani", "Maharajganj", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Paschim Champaran", "Pataliputra", "Patna Sahib", "Purnia", "Purvi Champaran", "Samastipur", "Saran", "Sasaram", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Ujiarpur", "Vaishali", "Valmiki Nagar"],
  "Chandigarh": ["Chandigarh"],
  "Chhattisgarh": ["Bastar", "Bilaspur", "Durg", "Janjgir–Champa", "Kanker", "Korba", "Mahasamund", "Raigarh", "Raipur", "Rajnandgaon", "Sarguja"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Dadra and Nagar Haveli", "Daman and Diu"],
  "Goa": ["North Goa", "South Goa"],
  "Gujarat": ["Ahmedabad East", "Ahmedabad West", "Amreli", "Anand", "Banaskantha", "Bardoli", "Bharuch", "Bhavnagar", "Chhota Udaipur", "Dahod", "Gandhinagar", "Jamnagar", "Junagadh", "Kachchh", "Kheda", "Mahesana", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Vadodara", "Valsad"],
  "Haryana": ["Ambala", "Bhiwani–Mahendragarh", "Faridabad", "Gurgaon", "Hisar", "Karnal", "Kurukshetra", "Rohtak", "Sirsa", "Sonipat"],
  "Himachal Pradesh": ["Hamirpur", "Kangra", "Mandi", "Shimla"],
  "Jammu and Kashmir": ["Anantnag–Rajouri", "Baramulla", "Jammu", "Srinagar", "Udhampur"],
  "Jharkhand": ["Chatra", "Dhanbad", "Dumka", "Giridih", "Godda", "Hazaribagh", "Jamshedpur", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahibganj", "Seraikela-Kharsawan", "Simdega", "West Singhbhum"],
  "Karnataka": ["Bagalkot", "Bangalore Central", "Bangalore North", "Bangalore Rural", "Bangalore South", "Belgaum", "Bellary", "Bidar", "Bijapur", "Chamarajanagar", "Chikballapur", "Chikkodi", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gulbarga", "Hassan", "Haveri", "Kolar", "Koppal", "Mandya", "Mysore", "Raichur", "Shimoga", "Tumkur", "Udupi Chikmagalur", "Uttara Kannada"],
  "Kerala": ["Alappuzha", "Alathur", "Attingal", "Chalakudy", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Mavelikara", "Palakkad", "Pathanamthitta", "Ponnani", "Thiruvananthapuram", "Thrissur", "Vatakara", "Wayanad"],
  "Ladakh": ["Ladakh"],
  "Lakshadweep": ["Lakshadweep"],
  "Madhya Pradesh": ["Balaghat", "Betul", "Bhind", "Bhopal", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur", "Khajuraho", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Shahdol", "Sidhi", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"],
  "Maharashtra": ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Baramati", "Beed", "Bhandara–Gondiya", "Bhiwandi", "Buldhana", "Chandrapur", "Dhule", "Dindori", "Gadchiroli–Chimur", "Hatkanangle", "Hingoli", "Jalgaon", "Jalna", "Kalyan", "Kolhapur", "Latur", "Madha", "Maval", "Mumbai North", "Mumbai North Central", "Mumbai North East", "Mumbai North West", "Mumbai South", "Mumbai South Central", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ramtek", "Ratnagiri–Sindhudurg", "Raver", "Sangli", "Satara", "Shirdi", "Shirur", "Solapur", "Thane", "Wardha", "Yavatmal–Washim"],
  "Manipur": ["Inner Manipur", "Outer Manipur"],
  "Meghalaya": ["Shillong", "Tura"],
  "Mizoram": ["Mizoram"],
  "Nagaland": ["Nagaland"],
  "Odisha": ["Aska", "Balasore", "Bargarh", "Berhampur", "Bhadrak", "Bhubaneswar", "Bolangir", "Cuttack", "Dhenkanal", "Jagatsinghpur", "Jajpur", "Kalahandi", "Kandhamal", "Kendrapara", "Keonjhar", "Koraput", "Mayurbhanj", "Nabarangpur", "Puri", "Sambalpur", "Sundargarh"],
  "Puducherry": ["Puducherry"],
  "Punjab": ["Amritsar", "Anandpur Sahib", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Firozpur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Khadoor Sahib", "Ludhiana", "Patiala", "Sangrur"],
  "Rajasthan": ["Ajmer", "Alwar", "Banswara", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Chittorgarh", "Churu", "Dausa", "Ganganagar", "Jaipur", "Jaipur Rural", "Jalore", "Jhalawar–Baran", "Jhunjhunu", "Jodhpur", "Karauli–Dholpur", "Kota", "Nagaur", "Pali", "Rajsamand", "Sikar", "Tonk–Sawai Madhopur", "Udaipur"],
  "Sikkim": ["Sikkim"],
  "Tamil Nadu": ["Arakkonam", "Arani", "Chennai Central", "Chennai North", "Chennai South", "Chidambaram", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kancheepuram", "Kanniyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pollachi", "Ramanathapuram", "Salem", "Sivaganga", "Sriperumbudur", "Tenkasi", "Thanjavur", "Theni", "Thiruvallur", "Thoothukkudi", "Tiruchirappalli", "Tirunelveli", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"],
  "Telangana": ["Adilabad", "Bhongir", "Chevella", "Hyderabad", "Karimnagar", "Khammam", "Mahabubabad", "Mahbubnagar", "Malkajgiri", "Medak", "Nagarkurnool", "Nalgonda", "Nizamabad", "Peddapalle", "Secunderabad", "Warangal", "Zahirabad"],
  "Tripura": ["Tripura East", "Tripura West"],
  "Uttar Pradesh": ["Agra", "Aligarh", "Allahabad", "Ambedkar Nagar", "Amethi", "Amroha", "Aonla", "Azamgarh", "Badaun", "Baghpat", "Bahraich", "Ballia", "Banda", "Bansgaon", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Bulandshahr", "Chandauli", "Deoria", "Dhaurahra", "Domariyaganj", "Etah", "Etawah", "Faizabad", "Farrukhabad", "Fatehpur", "Fatehpur Sikri", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Ghosi", "Gonda", "Gorakhpur", "Hamirpur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kairana", "Kaiserganj", "Kannauj", "Kanpur", "Kaushambi", "Kheri", "Kushi Nagar", "Lalganj", "Lucknow", "Machhlishahr", "Maharajganj", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Misrikh", "Mohanlalganj", "Moradabad", "Muzaffarnagar", "Nagina", "Phulpur", "Pilibhit", "Pratapgarh", "Rae Bareli", "Rampur", "Robertsganj", "Saharanpur", "Salempur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shrawasti", "Sitapur", "Sultanpur", "Unnao", "Varanasi"],
  "Uttarakhand": ["Almora", "Garhwal", "Haridwar", "Nainital–Udhamsingh Nagar", "Tehri Garhwal"],
  "West Bengal": ["Alipurduars", "Arambagh", "Asansol", "Baharampur", "Balurghat", "Bangaon", "Bankura", "Barasat", "Bardhaman Purba", "Bardhaman–Durgapur", "Barrackpore", "Basirhat", "Birbhum", "Bishnupur", "Bolpur", "Cooch Behar", "Darjeeling", "Diamond Harbour", "Dum Dum", "Ghatal", "Hooghly", "Howrah", "Jadavpur", "Jalpaiguri", "Jangipur", "Jaynagar", "Jhargram", "Kanthi", "Kolkata Dakshin", "Kolkata Uttar", "Krishnanagar", "Maldaha Dakshin", "Maldaha Uttar", "Mathurapur", "Medinipur", "Murshidabad", "Purulia", "Raiganj", "Ranaghat", "Srerampur", "Tamluk", "Uluberia"],
  "Delhi": ["Chandni Chowk", "East Delhi", "New Delhi", "North East Delhi", "North West Delhi", "South Delhi", "West Delhi"]
};

export default function Dashboard() {
  const [summary, setSummary] = useState({
    total_collected_kg: 0.0,
    processed_today_kg: 0.0,
    sent_to_recycling_kg: 0.0,
    sent_to_landfill_kg: 0.0,
    sent_to_wte_kg: 0.0,
    awaiting_processing_kg: 0.0
  });

  const [trends, setTrends] = useState({
    labels: [],
    datasets: {
      collected: [],
      recycled: [],
      landfill: [],
      wte: []
    }
  });

  const [filters, setFilters] = useState({
    range: "daily",
    state: "",
    category: ""
  });

  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);



  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = token ? { "Authorization": `Bearer ${token}` } : {};
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      // Fetch summary KPIs
      const queryParams = new URLSearchParams(filters).toString();
      const summaryRes = await fetch(`${baseUrl}/dashboard/summary?${queryParams}`, { headers });
      if (summaryRes.ok) {
        const summaryData = await summaryRes.json();
        setSummary(summaryData);
      }

      // Fetch trends based on active filters
      const trendsRes = await fetch(`${baseUrl}/analytics/trends?${queryParams}`, { headers });
      if (trendsRes.ok) {
        const trendsData = await trendsRes.json();
        setTrends(trendsData);
      }
    } catch (err) {
      console.error("Error loading dashboard metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 5000);
    return () => clearInterval(interval);
  }, [filters]);

  const triggerSeed = async () => {
    try {
      setSeeding(true);
      const token = localStorage.getItem("token");
      const headers = token ? { "Authorization": `Bearer ${token}` } : {};
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      const res = await fetch(`${baseUrl}/admin/seed`, {
        method: "POST",
        headers
      });
      if (res.ok) {
        alert("Database seeded successfully!");
        fetchDashboardData();
      }
    } catch (err) {
      console.error("Database seeding failed:", err);
    } finally {
      setSeeding(false);
    }
  };

  // Setup KPI Cards
  const kpis = [
    { title: "Total Collected (kg)", value: summary.total_collected_kg, icon: Box, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { title: "Processed Today (kg)", value: summary.processed_today_kg, icon: RefreshCw, color: "text-blue-400", bg: "bg-blue-400/10" },
    { title: "Sent for Recycling (kg)", value: summary.sent_to_recycling_kg, icon: TrendingUp, color: "text-teal-400", bg: "bg-teal-400/10" },
    { title: "Sent to Landfills (kg)", value: summary.sent_to_landfill_kg, icon: HeartCrack, color: "text-rose-400", bg: "bg-rose-400/10" },
    { title: "Waste-to-Energy (kg)", value: summary.sent_to_wte_kg, icon: BarChart3, color: "text-orange-400", bg: "bg-orange-400/10" },
    { title: "Awaiting Processing (kg)", value: summary.awaiting_processing_kg, icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-400/10" }
  ];

  // Chart configs
  const lineChartData = {
    labels: trends.labels.length > 0 ? trends.labels : ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [
      {
        fill: true,
        label: 'Collected Volume (kg)',
        data: trends.datasets.collected.length > 0 ? trends.datasets.collected : [0, 0, 0, 0, 0, 0, 0],
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.35,
      }
    ]
  };

  const barChartData = {
    labels: trends.labels.length > 0 ? trends.labels : ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [
      {
        label: 'Recycled',
        data: trends.datasets.recycled.length > 0 ? trends.datasets.recycled : [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(14, 165, 233, 0.8)', // Sky blue
      },
      {
        label: 'Waste-to-Energy',
        data: trends.datasets.wte.length > 0 ? trends.datasets.wte : [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(245, 158, 11, 0.8)', // Amber
      },
      {
        label: 'Landfill',
        data: trends.datasets.landfill.length > 0 ? trends.datasets.landfill : [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(239, 68, 68, 0.8)', // Rose
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, labels: { color: '#94a3b8' } }
    },
    scales: {
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8' }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-1">PlasticVision AI Overview</h1>
          <p className="text-textSecondary">Regional tracking, processing efficiency, and environmental compliance dashboard.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={triggerSeed} 
            disabled={seeding}
            className="px-4 py-2 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-xl text-primary font-semibold flex items-center gap-2 transition-all"
          >
            {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
            {seeding ? "Seeding..." : "Seed Sandbox Logs"}
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      <div className="p-5 rounded-2xl glass-card border border-glassBorder/40 bg-surface/30 backdrop-blur-lg flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-primary font-bold text-sm">
          <ListFilter className="w-5 h-5" /> Filters
        </div>
        
        {/* State */}
        <select 
          value={filters.state}
          onChange={(e) => setFilters({...filters, state: e.target.value})}
          className="bg-background border border-glassBorder rounded-xl px-3 py-1.5 text-sm text-textPrimary focus:outline-none focus:border-primary transition-colors"
        >
          <option value="">All States</option>
          {indianStatesAndUTs.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Waste Category */}
        <select 
          value={filters.category}
          onChange={(e) => setFilters({...filters, category: e.target.value})}
          className="bg-background border border-glassBorder rounded-xl px-3 py-1.5 text-sm text-textPrimary focus:outline-none focus:border-primary transition-colors"
        >
          <option value="">All Categories</option>
          <option value="PET">PET (Bottles)</option>
          <option value="HDPE">HDPE (Milk jugs)</option>
          <option value="LDPE">LDPE (Bags)</option>
          <option value="PP">PP (Caps/Tubs)</option>
          <option value="Other">Other Plastics</option>
        </select>

        {/* Range */}
        <select 
          value={filters.range}
          onChange={(e) => setFilters({...filters, range: e.target.value})}
          className="bg-background border border-glassBorder rounded-xl px-3 py-1.5 text-sm text-textPrimary focus:outline-none focus:border-primary transition-colors ml-auto"
        >
          <option value="daily">Last 7 Days (Daily)</option>
          <option value="monthly">Yearly (Monthly Agg)</option>
        </select>
      </div>

      {/* KPI Cards Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kpis.map((kpi, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="p-6 rounded-2xl glass-card flex items-center justify-between border border-glassBorder/30 bg-surface/40 hover:scale-[1.01] transition-transform duration-200"
            >
              <div>
                <p className="text-textSecondary text-xs font-semibold uppercase tracking-wider mb-2">{kpi.title}</p>
                <h3 className="text-3xl font-extrabold text-white">
                  {kpi.value.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                </h3>
              </div>
              <div className={`w-14 h-14 rounded-2xl ${kpi.bg} flex items-center justify-center`}>
                <kpi.icon className={`w-7 h-7 ${kpi.color}`} />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="p-6 rounded-2xl glass-card border border-glassBorder/30 bg-surface/30"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Plastic Waste Collection Trends</h3>
            <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Influx
            </span>
          </div>
          <div className="h-80 relative">
            <Line options={chartOptions} data={lineChartData} />
          </div>
        </motion.div>

        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="p-6 rounded-2xl glass-card border border-glassBorder/30 bg-surface/30"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Downstream Processing Output</h3>
            <span className="text-xs font-medium text-blue-400 bg-blue-400/10 px-2.5 py-1 rounded-full">
              Diverted
            </span>
          </div>
          <div className="h-80 relative">
            <Bar options={chartOptions} data={barChartData} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
