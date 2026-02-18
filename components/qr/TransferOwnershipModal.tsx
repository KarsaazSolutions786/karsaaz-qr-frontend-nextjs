/**
 * TransferOwnershipModal Component
 * 
 * Modal for transferring QR code ownership to another user.
 */

'use client';

import React, { useState } from 'react';
import { X, UserPlus, AlertCircle, Search } from 'lucide-react';

export interface TransferOwnershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCodeName: string;
  currentOwner: string;
  onTransfer: (options: {
    newOwnerId: string;
    transferDesign: boolean;
    transferAnalytics: boolean;
    notifyNewOwner: boolean;
  }) => Promise<void>;
  availableUsers?: Array<{ id: string; name: string; email: string }>;
}

export function TransferOwnershipModal({
  isOpen,
  onClose,
  qrCodeName,
  currentOwner,
  onTransfer,
  availableUsers = [],
}: TransferOwnershipModalProps) {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [transferDesign, setTransferDesign] = useState(true);
  const [transferAnalytics, setTransferAnalytics] = useState(false);
  const [notifyNewOwner, setNotifyNewOwner] = useState(true);
  const [isTransferring, setIsTransferring] = useState(false);
  const [error, setError] = useState('');
  
  if (!isOpen) return null;
  
  const filteredUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const selectedUser = availableUsers.find(u => u.id === selectedUserId);
  
  const handleTransfer = async () => {
    if (!selectedUserId) {
      setError('Please select a user to transfer to');
      return;
    }
    
    setIsTransferring(true);
    setError('');
    
    try {
      await onTransfer({
        newOwnerId: selectedUserId,
        transferDesign,
        transferAnalytics,
        notifyNewOwner,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transfer failed');
    } finally {
      setIsTransferring(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Transfer Ownership</h2>
              <p className="text-sm text-gray-500">Transfer "{qrCodeName}" to another user</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isTransferring}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-5">
            {/* Warning */}
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Important</p>
                <p className="text-xs text-red-700 mt-1">
                  Once transferred, you will lose access to this QR code unless the new owner grants you permission.
                  This action cannot be undone.
                </p>
              </div>
            </div>
            
            {/* Current Owner */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Owner
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                <span className="text-sm text-gray-900">{currentOwner}</span>
              </div>
            </div>
            
            {/* User Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transfer To
              </label>
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users by name or email..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              {/* User List */}
              <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                {filteredUsers.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    {searchQuery ? 'No users found' : 'No users available'}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredUsers.map(user => (
                      <label
                        key={user.id}
                        className={`
                          flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors
                          ${selectedUserId === user.id ? 'bg-indigo-50' : ''}
                        `}
                      >
                        <input
                          type="radio"
                          name="user"
                          value={user.id}
                          checked={selectedUserId === user.id}
                          onChange={(e) => setSelectedUserId(e.target.value)}
                          className="text-indigo-600"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Transfer Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What to Transfer
              </label>
              <div className="space-y-2">
                <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={transferDesign}
                    onChange={(e) => setTransferDesign(e.target.checked)}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Design Settings</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Transfer custom colors, logos, and styling
                    </div>
                  </div>
                </label>
                
                <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={transferAnalytics}
                    onChange={(e) => setTransferAnalytics(e.target.checked)}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Analytics Data</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Transfer scan history and analytics (not recommended)
                    </div>
                  </div>
                </label>
                
                <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyNewOwner}
                    onChange={(e) => setNotifyNewOwner(e.target.checked)}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Notify New Owner</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Send email notification about the transfer
                    </div>
                  </div>
                </label>
              </div>
            </div>
            
            {/* Selected User Confirmation */}
            {selectedUser && (
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                <p className="text-sm text-indigo-800">
                  Transferring to: <span className="font-medium">{selectedUser.name}</span> ({selectedUser.email})
                </p>
              </div>
            )}
            
            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isTransferring}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleTransfer}
            disabled={!selectedUserId || isTransferring}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50 flex items-center gap-2"
          >
            {isTransferring ? (
              <>
                <UserPlus className="w-4 h-4 animate-pulse" />
                <span>Transferring...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Transfer Ownership</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
