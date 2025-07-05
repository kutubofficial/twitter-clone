import React, { useRef, useState } from 'react';
import { Modal, Box, IconButton, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AvatarEditor from 'react-avatar-editor';
import { storage, auth } from '.././context/firbase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '.././context/firbase';

const AvatarSelector = ({ isOpen, onClose, currentAvatar }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [scale, setScale] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const editorRef = useRef(null);

  const defaultAvatars = [
    'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', 
    'https://cdn-icons-png.flaticon.com/512/147/147144.png', 
    'https://cdn-icons-png.flaticon.com/512/4333/4333609.png', 
    'https://cdn-icons-png.flaticon.com/512/4140/4140048.png', 
    'https://cdn-icons-png.flaticon.com/512/921/921071.png', 
    'https://cdn-icons-png.flaticon.com/512/3001/3001758.png' 
  ];

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setActiveTab('upload');
    }
  };

  const uploadAvatar = async (imageBlob) => {
    const storageRef = ref(storage, `avatars/${auth.currentUser.uid}`);
    const snapshot = await uploadBytes(storageRef, imageBlob);
    return await getDownloadURL(snapshot.ref);
  };

  const updateUserProfile = async (photoURL) => {
    await updateProfile(auth.currentUser, { photoURL });
    
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        photoURL: photoURL,
        lastUpdated: new Date()
      });
    } catch (error) {
      console.log("Firestore update skipped or failed", error);
    }
  };

  const handleSave = async () => {
    if (!editorRef.current) return;
    
    setIsLoading(true);
    try {
      const canvas = editorRef.current.getImageScaledToCanvas();
      const blob = await new Promise(resolve => canvas.toBlob(resolve));
      const photoURL = await uploadAvatar(blob);
      await updateUserProfile(photoURL);
      onClose();
    } catch (error) {
      console.error("Error updating avatar:", error);
      alert("Failed to update avatar. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDefaultSelect = async (avatarUrl) => {
    setIsLoading(true);
    try {
      await updateUserProfile(avatarUrl);
      onClose();
    } catch (error) {
      console.error("Error updating avatar:", error);
      alert("Failed to update avatar. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 3,
        borderRadius: 2,
        outline: 'none'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Update Profile Picture</h2>
          <IconButton onClick={onClose} disabled={isLoading}>
            <CloseIcon />
          </IconButton>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid #eee', marginBottom: '20px' }}>
          <button 
            onClick={() => setActiveTab('upload')}
            style={{
              padding: '10px',
              background: activeTab === 'upload' ? '#f0f0f0' : 'transparent',
              border: 'none',
              fontWeight: activeTab === 'upload' ? 'bold' : 'normal',
              cursor: 'pointer',
              flex: 1
            }}
          >
            Upload Photo
          </button>
          <button 
            onClick={() => setActiveTab('default')}
            style={{
              padding: '10px',
              background: activeTab === 'default' ? '#f0f0f0' : 'transparent',
              border: 'none',
              fontWeight: activeTab === 'default' ? 'bold' : 'normal',
              cursor: 'pointer',
              flex: 1
            }}
          >
            Choose Default
          </button>
        </div>

        {activeTab === 'upload' ? (
          <>
            <div style={{ marginBottom: '20px' }}>
              <input 
                type="file" 
                id="avatar-upload"
                onChange={handleFileChange} 
                accept="image/*"
                disabled={isLoading}
                style={{ display: 'none' }}
              />
              <label htmlFor="avatar-upload" style={{
                display: 'block',
                padding: '10px 15px',
                backgroundColor: '#1a73e8',
                color: 'white',
                borderRadius: '4px',
                textAlign: 'center',
                cursor: 'pointer',
                opacity: isLoading ? 0.7 : 1
              }}>
                {selectedFile ? 'Change Image' : 'Select Image'}
              </label>
            </div>

            {selectedFile && (
              <>
                <AvatarEditor
                  ref={editorRef}
                  image={selectedFile}
                  width={250}
                  height={250}
                  border={50}
                  borderRadius={125}
                  color={[255, 255, 255, 0.6]}
                  scale={scale}
                  rotate={0}
                  style={{ display: 'block', margin: '0 auto' }}
                />
                <div style={{ margin: '15px 0', textAlign: 'center' }}>
                  <label style={{ marginRight: '10px' }}>Zoom:</label>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.1"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    disabled={isLoading}
                    style={{ width: '60%' }}
                  />
                </div>
                <button 
                  onClick={handleSave}
                  disabled={isLoading || !selectedFile}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#1a73e8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: (isLoading || !selectedFile) ? 0.7 : 1
                  }}
                >
                  {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Save Changes'}
                </button>
              </>
            )}
          </>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
            {defaultAvatars?.map((avatar, index) => (
              <div 
                key={index} 
                onClick={() => !isLoading && handleDefaultSelect(avatar)}
                style={{
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1,
                  border: currentAvatar === avatar ? '3px solid #1a73e8' : '3px solid transparent',
                  borderRadius: '50%',
                  padding: '2px'
                }}
              >
                <img
                  src={avatar}
                  alt={`Avatar ${index}`}
                  style={{
                    width: '100%',
                    borderRadius: '50%',
                    aspectRatio: '1/1',
                    objectFit: 'cover'
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </Box>
    </Modal>
  );
};

export default AvatarSelector;