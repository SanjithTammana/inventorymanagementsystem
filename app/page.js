'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField, FormControl, InputLabel, Select, MenuItem, Autocomplete, InputAdornment, Switch } from '@mui/material'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'
import SearchIcon from '@mui/icons-material/Search'
import { styled } from '@mui/system'

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #000000 30%, #0000FF 90%)',
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .3)',
  color: 'white',
  padding: '0 30px',
  height: 48,
}))

const GradientTypography = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(45deg, #000000 30%, #0000FF 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}))

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 3,
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [filterCategory, setFilterCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [accessible, setAccessible] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    updateInventory()
  }, [])

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    inventoryList.sort((a, b) => a.name.localeCompare(b.name))
    setInventory(inventoryList)
    updateCategories(inventoryList)
  }

  const updateCategories = (inventoryList) => {
    const categorySet = new Set(inventoryList.map(item => item.category))
    setCategories([...categorySet])
  }

  const addItem = async (item, category) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1, category }, { merge: true })
    } else {
      await setDoc(docRef, { quantity: 1, category })
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 }, { merge: true })
      }
    }
    await updateInventory()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setItemName('')
    setCategory('')
  }

  const handleAddItem = async () => {
    if (itemName.trim() && category.trim()) {
      if (!categories.includes(category)) {
        setCategories([...categories, category])
      }
      await addItem(itemName, category)
      setItemName('')
      setCategory('')
      handleClose()
    } else {
      alert('Please enter a valid item name and category.')
    }
  }

  const groupByCategory = (items) => {
    return items.reduce((acc, item) => {
      const { category } = item
      if (!acc[category]) acc[category] = []
      acc[category].push(item)
      return acc
    }, {})
  }

  const filteredInventory = inventory.filter(item => {
    const matchesCategory = filterCategory ? item.category === filterCategory : true
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const groupedInventory = groupByCategory(filteredInventory)

  const getBackgroundColor = () => {
    if (darkMode) {
      return accessible ? "#303030" : "#212121"
    }
    return accessible ? "#eaeaea" : "#f5f5f5"
  }

  const getTextColor = () => accessible ? "#FFFFFF" : darkMode ? "#FFFFFF" : "#000000"
  const getItemBackgroundColor = () => {
    if (accessible) {
      return darkMode ? '#FF5733' : '#FFC300'
    }
    return darkMode ? '#424242' : '#f0f0f0'
  }
  const getCategoryBackgroundColor = () => {
    if (accessible) {
      return darkMode ? '#C70039' : '#FF5733'
    }
    return darkMode ? '#555555' : '#ddd'
  }
  const getItemTextColor = () => accessible ? "#FFFFFF" : darkMode ? '#eaeaea' : '#333'

  return (
    <Box
      width="100%"
      height="100vh"
      display="flex"
      flexDirection="column"
      gap={2}
      bgcolor={getBackgroundColor()}
      color={getTextColor()}
      p={2}
    >
      <Box mb={2} display="flex" justifyContent="center" alignItems="center" gap={2}>
        <Typography variant="button" color="textSecondary">
          Accessibility Mode
        </Typography>
        <Switch
          checked={accessible}
          onChange={(e) => setAccessible(e.target.checked)}
          color="primary"
          aria-label="Toggle accessibility mode"
        />
        <Typography variant="button" color="textSecondary">
          Dark Mode
        </Typography>
        <Switch
          checked={darkMode}
          onChange={(e) => setDarkMode(e.target.checked)}
          color="primary"
          aria-label="Toggle dark mode"
        />
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style, borderRadius: 3 }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction="column" spacing={2}>
            <TextField
              id="item-name"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              aria-label="Item name"
            />
            <FormControl fullWidth>
              <Autocomplete
                freeSolo
                options={categories}
                value={category}
                onInputChange={(e, newInputValue) => setCategory(newInputValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Category" variant="outlined" aria-label="Category" />
                )}
              />
            </FormControl>
            <GradientButton
              variant="contained"
              onClick={handleAddItem}
            >
              Add
            </GradientButton>
          </Stack>
        </Box>
      </Modal>
      <GradientButton onClick={handleOpen} aria-label="Add new item">
        Add New Item
      </GradientButton>
      <Box
        width="100%"
        display="flex"
        flexDirection="column"
        gap={2}
        p={2}
      >
        <GradientTypography variant="h2" textAlign="center">
          Inventory Items
        </GradientTypography>
        <FormControl fullWidth>
          <InputLabel>Filter by Category</InputLabel>
          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            label="Filter by Category"
            aria-label="Filter by Category"
          >
            <MenuItem value="">
              <em>All Categories</em>
            </MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Autocomplete
          freeSolo
          options={inventory.map(item => item.name)}
          onInputChange={(e, newInputValue) => setSearchQuery(newInputValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search"
              variant="outlined"
              fullWidth
              margin="normal"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              aria-label="Search items"
            />
          )}
        />
        <Stack spacing={2} mt={2}>
          {Object.entries(groupedInventory).map(([category, items]) => (
            <Box key={category}>
              <Box
                px={2}
                py={1}
                mb={1}
                bgcolor={getCategoryBackgroundColor()}
                borderRadius={1}
                boxShadow={1}
              >
                <Typography variant="h5" color={getItemTextColor()}>{category}</Typography>
              </Box>
              {items.map((item) => (
                <Box
                  key={item.name}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  px={2}
                  py={1}
                  mb={1}
                  bgcolor={getItemBackgroundColor()}
                  borderRadius={1}
                  boxShadow={1}
                >
                  <Typography variant="h6" color={getItemTextColor()}>{item.name}</Typography>
                  <Typography variant="body1" color={getItemTextColor()}>{item.quantity}</Typography>
                  <Box display="flex" gap={1}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => addItem(item.name, category)}
                    >
                      Add
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => removeItem(item.name)}
                    >
                      Remove
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
