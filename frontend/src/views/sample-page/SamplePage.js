// กำหนดชื่อตัวแปรและการ Import คอมโพเนนต์ที่ต้องใช้
import React, { useState, useEffect } from 'react';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell, Button, TextField, Modal, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PageContainer from 'src/components/container/PageContainer'; // นำเข้าคอมโพเนนต์ PageContainer
import DashboardCard from '../../components/shared/DashboardCard'; // นำเข้าคอมโพเนนต์ DashboardCard
import { db } from '../../firebase_config'; // นำเข้า Firebase Firestore instance จาก firebase_config.js
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore"; // นำเข้าฟังก์ชันที่ใช้จัดการข้อมูล Firestore
import CustomModal from './modalWeather';
import { getRoles } from 'src/api/apiAuth'; // นำเข้าฟังก์ชัน getRoles จาก apiAuth.js

const SamplePage = () => { // สร้างคอมโพเนนต์ SamplePage
  const [weatherData, setWeatherData] = useState(null); // กำหนด state สำหรับเก็บข้อมูลสภาพอากาศ
  const [newWeatherEntry, setNewWeatherEntry] = useState({ province: '', humidity: '', temperature: '' }); // กำหนด state สำหรับเก็บข้อมูลสภาพอากาศใหม่ที่ต้องการเพิ่มหรือแก้ไข
  const [modalOpen, setModalOpen] = useState(false); // กำหนด state สำหรับเปิดหรือปิด Modal
  const [isEdit, setIsEdit] = useState(false); // กำหนด state สำหรับแสดงว่าเป็นโหมดแก้ไขหรือไม่
  const [selectedEntryId, setSelectedEntryId] = useState(null); // กำหนด state สำหรับเก็บ ID ของรายการที่ถูกเลือก
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false); // กำหนด state สำหรับเปิดหรือปิด Dialog ยืนยันการลบ
  const [entryToDeleteId, setEntryToDeleteId] = useState(null); // กำหนด state สำหรับเก็บ ID ของรายการที่ต้องการลบ
  const [loading, setLoading] = useState(true); // กำหนด state สำหรับแสดงสถานะการโหลดข้อมูล

  useEffect(() => { // สร้าง useEffect สำหรับโหลดข้อมูลสภาพอากาศเมื่อคอมโพเนนต์ถูกโหลด
    fetchData(); // เรียกใช้ฟังก์ชัน fetchData
  }, []);

  const fetchData = async () => { // สร้างฟังก์ชัน fetchData เพื่อดึงข้อมูลจาก Firestore
    setLoading(true); // ตั้งค่า loading เป็น true เพื่อแสดงสถานะการโหลดข้อมูล
    const data = []; // สร้างตัวแปร data เพื่อเก็บข้อมูล
    const querySnapshot = await getDocs(collection(db, 'weatherData')); // ดึงข้อมูลจาก Firestore
    querySnapshot.forEach((doc) => { // วนลูปผ่านเอกสารที่ได้
      data.push({ id: doc.id, ...doc.data() }); // เพิ่มข้อมูลลงในตัวแปร data
    });
    setWeatherData(data); // อัปเดตข้อมูลสภาพอากาศ
    setLoading(false); // ตั้งค่า loading เป็น false เมื่อข้อมูลโหลดเสร็จสมบูรณ์
  };

  const handleOpenModal = (editMode = false, entryId = null) => { // สร้างฟังก์ชัน handleOpenModal เพื่อเปิด Modal
    setIsEdit(editMode); // ตั้งค่า isEdit ตามโหมดการแก้ไข
    if (editMode) { // ถ้าเป็นโหมดแก้ไข
      const entryToEdit = weatherData.find(entry => entry.id === entryId); // หาข้อมูลที่ต้องการแก้ไข
      setNewWeatherEntry({ // อัปเดตข้อมูลสภาพอากาศใหม่
        province: entryToEdit.province,
        humidity: entryToEdit.humidity,
        temperature: entryToEdit.temperature
      });
      setSelectedEntryId(entryId); // ตั้งค่า ID ของรายการที่เลือก
    } else { // ถ้าไม่ใช่โหมดแก้ไข
      setNewWeatherEntry({ province: '', humidity: '', temperature: '' }); // เริ่มต้นข้อมูลสภาพอากาศใหม่
    }
    setModalOpen(true); // เปิด Modal
  };

  const handleCloseModal = () => { // สร้างฟังก์ชัน handleCloseModal เพื่อปิด Modal
    setModalOpen(false); // ปิด Modal
    setIsEdit(false); // ตั้งค่า isEdit เป็น false
    setSelectedEntryId(null); // ล้าง ID ของรายการที่เลือก
  };

  const handleAddOrUpdateEntry = async () => { // สร้างฟังก์ชัน handleAddOrUpdateEntry เพื่อเพิ่มหรืออัปเดตข้อมูลสภาพอากาศ
    if (isEdit && selectedEntryId) { // ถ้าเป็นโหมดแก้ไขและมี ID ของรายการที่เลือก
      const entryRef = doc(db, 'weatherData', selectedEntryId); // อ้างอิงไปยังเอกสารที่ต้องการแก้ไข
      await updateDoc(entryRef, newWeatherEntry); // อัปเดตข้อมูล
    } else { // ถ้าไม่ใช่โหมดแก้ไข
      await addDoc(collection(db, 'weatherData'), newWeatherEntry); // เพิ่มข้อมูลใหม่ลงใน Firestore
    }
    fetchData(); // โหลดข้อมูลใหม่
    handleCloseModal(); // ปิด Modal
  };

  const handleDelete = (id) => { // สร้างฟังก์ชัน handleDelete เพื่อลบรายการ
    setEntryToDeleteId(id); // กำหนด ID ของรายการที่ต้องการลบ
    setDeleteConfirmationOpen(true); // เปิด Dialog ยืนยันการลบ
  };

  const handleDeleteConfirmation = async () => { // สร้างฟังก์ชัน handleDeleteConfirmation เพื่อยืนยันการลบรายการ
    await deleteDoc(doc(db, 'weatherData', entryToDeleteId)); // ลบเอกสาร
    fetchData(); // โหลดข้อมูลใหม่
    setDeleteConfirmationOpen(false); // ปิด Dialog ยืนยันการลบ
  };

  const handleChange = (e) => { // สร้างฟังก์ชัน handleChange เพื่อจัดการการเปลี่ยนแปลงข้อมูลของสภาพอากาศ
    const { name, value } = e.target; // ดึงค่า name และ value จากอิเวนต์
    setNewWeatherEntry({ ...newWeatherEntry, [name]: value }); // อัปเดตข้อมูลสภาพอากาศใหม่
  };
  return (
    <PageContainer title="Weather Data Management" description="Manage weather data for Thailand">
      <DashboardCard title="Weather Data">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>Add Entry</Button>
        </div>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <CircularProgress />
          </div>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Province</TableCell>
                <TableCell>Humidity</TableCell>
                <TableCell>Temperature</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {weatherData && weatherData.map(entry => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.id}</TableCell>
                  <TableCell>{entry.province}</TableCell>
                  <TableCell>{entry.humidity}</TableCell>
                  <TableCell>{entry.temperature}</TableCell>
                  <TableCell>
                    <Button style={{marginRight:"1vw"}} variant="outlined" color="primary" startIcon={<EditIcon />} onClick={() => handleOpenModal(true, entry.id)}>Edit</Button>
                    <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(entry.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DashboardCard>
      <Modal open={modalOpen} onClose={handleCloseModal} style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)' // Semi-transparent background
      }}>
        <div style={{ backgroundColor: "white", padding: "3%", borderRadius: "12px", width:"30vw" }}>
          <Typography variant="h6">{isEdit ? 'Edit Entry' : 'Add Entry'}</Typography>
          <TextField
            name="province"
            label="Province"
            value={newWeatherEntry.province}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            sx={{width:"100%"}}
          /><br />
          <TextField
            name="humidity"
            label="Humidity"
            value={newWeatherEntry.humidity}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            sx={{width:"100%"}}
          /><br />
          <TextField
            name="temperature"
            label="Temperature"
            value={newWeatherEntry.temperature}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            sx={{width:"100%"}}
          /><br />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button variant="contained" color="primary" onClick={handleAddOrUpdateEntry}>{isEdit ? "Update" : "Add"}  </Button>
          </div>
        </div>
      </Modal>
      <Dialog open={deleteConfirmationOpen} onClose={() => setDeleteConfirmationOpen(false)}>
        <DialogTitle>Delete Entry</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this entry?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmationOpen(false)} color="primary">Cancel</Button>
          <Button onClick={handleDeleteConfirmation} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default SamplePage; // ส่งออกคอมโพเนนต์ SamplePage
