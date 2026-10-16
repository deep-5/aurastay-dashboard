import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { Card, Badge, Button, Modal } from '../components/ui';
import {
  Inbox as InboxIcon,
  Star,
  Send,
  FileText,
  AlertOctagon,
  Trash2,
  Search,
  Plus,
  Mail,
  User,
  Paperclip,
  CheckCircle2,
  CornerUpLeft,
  Forward,
  MoreVertical,
  CheckCheck,
  Bold,
  Italic,
  Link2,
  Smile,
  Image as ImageIcon
} from 'lucide-react';
import { MessageCategory, MessageFolder, InboxMessage } from '../types';

export const InboxView: React.FC = () => {
  const {
    inboxMessages,
    sendInboxMessage,
    replyInboxMessage,
    toggleStarMessage,
    markMessageRead,
    deleteMessage,
    currentUser,
    guests,
    staff,
  } = useHotel();

  const [activeFolder, setActiveFolder] = useState<MessageFolder>('inbox');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessageId, setSelectedMessageId] = useState<string>(inboxMessages[0]?.id || '');
  const [replyText, setReplyText] = useState('');
  const [replySuccess, setReplySuccess] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);

  // Compose State
  const [composeRecipient, setComposeRecipient] = useState('');
  const [composeCategory, setComposeCategory] = useState<MessageCategory>('Guest Inquiry');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');

  // Filter messages
  const filteredMessages = inboxMessages.filter(msg => {
    if (activeFolder === 'starred') {
      if (!msg.starred) return false;
    } else {
      if (msg.folder !== activeFolder) return false;
    }

    if (selectedCategory !== 'All' && msg.category !== selectedCategory) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSubject = msg.subject.toLowerCase().includes(q);
      const matchSender = msg.senderName.toLowerCase().includes(q);
      const matchBody = msg.body.toLowerCase().includes(q);
      if (!matchSubject && !matchSender && !matchBody) return false;
    }

    return true;
  });

  const selectedMessage = inboxMessages.find(m => m.id === selectedMessageId) || filteredMessages[0];

  const handleSelectMessage = (msg: InboxMessage) => {
    setSelectedMessageId(msg.id);
    if (msg.unread) {
      markMessageRead(msg.id, false);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedMessage) return;

    replyInboxMessage(selectedMessage.id, replyText);
    setReplyText('');
    setReplySuccess(true);
    setTimeout(() => setReplySuccess(false), 2500);
  };

  const handleComposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeRecipient || !composeSubject || !composeBody) return;

    sendInboxMessage({
      folder: 'sent',
      category: composeCategory,
      senderName: currentUser.name,
      senderEmail: currentUser.email,
      senderAvatar: currentUser.avatar,
      recipient: composeRecipient,
      subject: composeSubject,
      preview: composeBody.substring(0, 80) + '...',
      body: composeBody,
    });

    setComposeRecipient('');
    setComposeSubject('');
    setComposeBody('');
    setComposeOpen(false);
  };

  const handleDeleteWithConfirm = (id: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      deleteMessage(id);
    }
  };

  // Folder Counts
  const inboxCount = inboxMessages.filter(m => m.folder === 'inbox' && m.unread).length;
  const starredCount = inboxMessages.filter(m => m.starred).length;
  const sentCount = inboxMessages.filter(m => m.folder === 'sent').length;
  const draftsCount = inboxMessages.filter(m => m.folder === 'drafts').length;
  const trashCount = inboxMessages.filter(m => m.folder === 'trash').length;

  const categories: MessageCategory[] = [
    'Guest Inquiry',
    'Reservation Update',
    'Internal Notice',
    'Payment Issue',
    'Room Service Request',
  ];

  return (
    <div className="bg-white border border-[#E7EBF0] rounded-xl shadow-subtle overflow-hidden h-[calc(100vh-130px)] flex flex-col animate-in fade-in">
      {/* 3 Columns Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden divide-y md:divide-y-0 md:divide-x divide-[#E7EBF0]">
        
        {/* COLUMN 1: Folders & Categories (Left) */}
        <div className="w-full md:w-56 lg:w-64 bg-[#FFFFFF] p-3 flex-shrink-0 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            {/* Compose Button */}
            {/* Compose Button matching Reference Image 1 */}
            <button
              onClick={() => setComposeOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#2583E9] hover:bg-[#1768C4] text-white font-bold text-xs shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ New Message</span>
            </button>

            {/* Folders List */}
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider px-2 block mb-1">
                Mail Folders
              </span>

              <button
                onClick={() => setActiveFolder('inbox')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  activeFolder === 'inbox' ? 'bg-[#EAF3FF] text-[#2583E9]' : 'text-[#202938] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <InboxIcon className="w-4 h-4" />
                  <span>Inbox</span>
                </div>
                {inboxCount > 0 && (
                  <span className="px-2 py-0.5 bg-[#D2F829] text-[#19202D] text-[10px] font-black rounded-full shadow-xs">
                    {inboxCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveFolder('starred')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  activeFolder === 'starred' ? 'bg-[#EAF3FF] text-[#2583E9]' : 'text-[#202938] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Star className="w-4 h-4 text-[#F4C928]" />
                  <span>Starred</span>
                </div>
                {starredCount > 0 && <span className="text-[10px] text-[#6B7280]">{starredCount}</span>}
              </button>

              <button
                onClick={() => setActiveFolder('sent')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  activeFolder === 'sent' ? 'bg-[#EAF3FF] text-[#2583E9]' : 'text-[#202938] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Send className="w-4 h-4" />
                  <span>Sent Items</span>
                </div>
                <span className="text-[10px] text-[#6B7280]">{sentCount}</span>
              </button>

              <button
                onClick={() => setActiveFolder('drafts')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  activeFolder === 'drafts' ? 'bg-[#EAF3FF] text-[#2583E9]' : 'text-[#202938] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4" />
                  <span>Drafts</span>
                </div>
                {draftsCount > 0 && <span className="text-[10px] text-[#6B7280]">{draftsCount}</span>}
              </button>

              <button
                onClick={() => setActiveFolder('spam')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  activeFolder === 'spam' ? 'bg-[#EAF3FF] text-[#2583E9]' : 'text-[#202938] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <AlertOctagon className="w-4 h-4" />
                  <span>Spam</span>
                </div>
              </button>

              <button
                onClick={() => setActiveFolder('trash')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  activeFolder === 'trash' ? 'bg-[#EAF3FF] text-[#2583E9]' : 'text-[#202938] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Trash2 className="w-4 h-4" />
                  <span>Trash</span>
                </div>
                {trashCount > 0 && <span className="text-[10px] text-[#6B7280]">{trashCount}</span>}
              </button>
            </div>

            {/* Categories Filter */}
            <div className="space-y-0.5 pt-2 border-t border-[#E7EBF0]">
              <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider px-2 block mb-1">
                Hotel Categories
              </span>

              <button
                onClick={() => setSelectedCategory('All')}
                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategory === 'All' ? 'bg-[#F8FAFC] text-[#2583E9] font-bold' : 'text-[#202938] hover:bg-[#F8FAFC]'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#202938]" />
                <span>All Categories</span>
              </button>

              {categories.map((cat) => {
                const colorMap: Record<string, string> = {
                  'Guest Inquiry': 'bg-[#2583E9]',
                  'Reservation Update': 'bg-[#D2F829] border border-black/20',
                  'Internal Notice': 'bg-[#FA6B6B]',
                  'Payment Issue': 'bg-[#F4C928]',
                  'Room Service Request': 'bg-[#3298E8]',
                };

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedCategory === cat ? 'bg-[#EAF3FF] text-[#2583E9] font-bold' : 'text-[#202938] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${colorMap[cat] || 'bg-slate-400'}`} />
                    <span className="truncate">{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-2 bg-[#F8FAFC] border border-[#E7EBF0] rounded-lg text-[10px] text-[#6B7280] mt-4">
            <span className="font-bold text-[#202938] block mb-0.5">Guest Inbox Connected</span>
            Internal hotel communications system synced with reservations desk.
          </div>
        </div>

        {/* COLUMN 2: Message List (Middle) */}
        <div className="w-full md:w-80 lg:w-96 flex flex-col flex-shrink-0 bg-white overflow-hidden">
          {/* Search & Header */}
          <div className="p-3 border-b border-[#E7EBF0] space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subject or sender..."
                className="w-full bg-[#F8FAFC] text-xs pl-8 pr-3 py-1.5 rounded-lg border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9]"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-[#6B7280]">
              <span>{filteredMessages.length} Messages</span>
              {selectedCategory !== 'All' && (
                <span className="px-2 py-0.5 bg-[#EAF3FF] text-[#2583E9] rounded text-[10px] font-semibold">
                  {selectedCategory}
                </span>
              )}
            </div>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#E7EBF0]">
            {filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#6B7280]">
                No messages found in this folder.
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isSelected = selectedMessage?.id === msg.id;

                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`p-3.5 cursor-pointer transition-colors relative flex items-start gap-3 ${
                      isSelected
                        ? 'bg-[#EAF3FF]/70 border-l-4 border-l-[#2583E9]'
                        : msg.unread
                        ? 'bg-white font-semibold'
                        : 'bg-white hover:bg-[#F8FAFC] opacity-90'
                    }`}
                  >
                    {/* Unread indicator */}
                    {msg.unread && (
                      <span className="absolute top-4 left-1.5 w-1.5 h-1.5 bg-[#2583E9] rounded-full" />
                    )}

                    {/* Avatar */}
                    {msg.senderAvatar ? (
                      <img
                        src={msg.senderAvatar}
                        alt={msg.senderName}
                        className="w-8 h-8 rounded-full object-cover border border-[#E7EBF0] flex-shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#F1F5F9] text-[#2583E9] flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {msg.senderName[0]}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-xs font-bold text-[#202938] truncate">{msg.senderName}</span>
                        <span className="text-[10px] text-[#6B7280] flex-shrink-0">
                          {msg.timestamp.substring(11, 16)}
                        </span>
                      </div>

                      <p className={`text-xs text-[#202938] truncate ${msg.unread ? 'font-bold' : 'font-medium'}`}>
                        {msg.subject}
                      </p>

                      <p className="text-[11px] text-[#6B7280] truncate mt-0.5">
                        {msg.preview}
                      </p>

                      <div className="flex items-center justify-between mt-2 pt-1">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-[#475569] font-medium">
                          {msg.category}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStarMessage(msg.id);
                          }}
                          className="text-[#6B7280] hover:text-[#F4C928]"
                        >
                          <Star className={`w-3.5 h-3.5 ${msg.starred ? 'fill-[#F4C928] text-[#F4C928]' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* COLUMN 3: Selected Message Details & Reply (Right) */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          {selectedMessage ? (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* Header Action Toolbar */}
              <div className="p-4 border-b border-[#E7EBF0] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Badge variant="info">{selectedMessage.category}</Badge>
                  {selectedMessage.roomId && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#F8FAFC] border border-[#E7EBF0] text-[#202938]">
                      Room {selectedMessage.roomId.replace('RM-', '')}
                    </span>
                  )}
                  {selectedMessage.reservationId && (
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#F8FAFC] border border-[#E7EBF0] text-[#2583E9]">
                      {selectedMessage.reservationId}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleStarMessage(selectedMessage.id)}
                    title="Star Message"
                    className="p-1.5 text-[#6B7280] hover:text-[#F4C928] rounded-lg hover:bg-[#F8FAFC]"
                  >
                    <Star className={`w-4 h-4 ${selectedMessage.starred ? 'fill-[#F4C928] text-[#F4C928]' : ''}`} />
                  </button>

                  <button
                    onClick={() => markMessageRead(selectedMessage.id, !selectedMessage.unread)}
                    title="Mark Unread"
                    className="p-1.5 text-[#6B7280] hover:text-[#202938] rounded-lg hover:bg-[#F8FAFC]"
                  >
                    <Mail className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteWithConfirm(selectedMessage.id)}
                    title="Delete Message"
                    className="p-1.5 text-[#6B7280] hover:text-[#E85B63] rounded-lg hover:bg-[#FDF2F2]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message Details Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-[#202938] mb-3">
                    {selectedMessage.subject}
                  </h2>

                  <div className="flex items-center justify-between gap-4 p-3 bg-[#F8FAFC] border border-[#E7EBF0] rounded-xl">
                    <div className="flex items-center gap-3">
                      {selectedMessage.senderAvatar ? (
                        <img
                          src={selectedMessage.senderAvatar}
                          alt={selectedMessage.senderName}
                          className="w-10 h-10 rounded-full object-cover border border-[#E7EBF0]"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#EAF3FF] text-[#2583E9] flex items-center justify-center font-bold text-sm">
                          {selectedMessage.senderName[0]}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#202938]">{selectedMessage.senderName}</span>
                          <span className="text-xs text-[#6B7280]">&lt;{selectedMessage.senderEmail}&gt;</span>
                        </div>
                        <p className="text-xs text-[#6B7280]">To: {selectedMessage.recipient}</p>
                      </div>
                    </div>

                    <span className="text-xs text-[#6B7280] font-medium">
                      {selectedMessage.timestamp}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-[#202938] leading-relaxed whitespace-pre-line p-2">
                  {selectedMessage.body}
                </div>
              </div>

              {/* Reply Section */}
              <div className="p-4 border-t border-[#E7EBF0] bg-[#F8FAFC]">
                {replySuccess && (
                  <div className="mb-2 p-2.5 bg-[#EBF7F0] border border-[#C6ECD7] text-[#20A66A] text-xs font-semibold rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Reply sent successfully to {selectedMessage.senderName}!
                  </div>
                )}

                <form onSubmit={handleSendReply} className="space-y-3">
                  <div className="relative rounded-xl border border-[#E7EBF0] bg-white overflow-hidden focus-within:border-[#2583E9]">
                    {/* Rich text formatting bar matching reference Image 1 */}
                    <div className="flex items-center gap-1 px-3 py-1.5 border-b border-[#E7EBF0] bg-[#F8FAFC]/80 text-[#6B7280]">
                      <button type="button" className="p-1 hover:text-[#202938] hover:bg-[#EAF3FF] rounded transition-colors" title="Bold">
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" className="p-1 hover:text-[#202938] hover:bg-[#EAF3FF] rounded transition-colors" title="Italic">
                        <Italic className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" className="p-1 hover:text-[#202938] hover:bg-[#EAF3FF] rounded transition-colors" title="Link">
                        <Link2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="h-3.5 w-px bg-[#E7EBF0] mx-1" />
                      <button type="button" className="p-1 hover:text-[#202938] hover:bg-[#EAF3FF] rounded transition-colors" title="Attach file">
                        <Paperclip className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" className="p-1 hover:text-[#202938] hover:bg-[#EAF3FF] rounded transition-colors" title="Add emoji">
                        <Smile className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" className="p-1 hover:text-[#202938] hover:bg-[#EAF3FF] rounded transition-colors" title="Add image">
                        <ImageIcon className="w-3.5 h-3.5" />
                      </button>

                      {/* Quick Template Pills */}
                      <div className="ml-auto hidden sm:flex items-center gap-1.5 text-[10px]">
                        <button
                          type="button"
                          onClick={() => setReplyText('Good day! Your request has been confirmed and scheduled with our concierge team. Please let us know if you need anything else.')}
                          className="px-2 py-0.5 rounded-full bg-white border border-[#E7EBF0] text-[#475569] hover:bg-[#EAF3FF] hover:text-[#2583E9] whitespace-nowrap"
                        >
                          Quick: Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setReplyText('Hello! We have noted your arrival time and held your suite guaranteed. Safe travels!')}
                          className="px-2 py-0.5 rounded-full bg-white border border-[#E7EBF0] text-[#475569] hover:bg-[#EAF3FF] hover:text-[#2583E9] whitespace-nowrap"
                        >
                          Quick: Arrival
                        </button>
                      </div>
                    </div>

                    <textarea
                      rows={3}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Reply directly to ${selectedMessage.senderName}...`}
                      className="w-full text-xs p-3 focus:outline-none bg-white resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                      <span className="w-2 h-2 rounded-full bg-[#20A66A]" />
                      <span>Responding as: {currentUser.name} ({currentUser.role})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (replyText.trim()) {
                            alert('Draft saved successfully to Drafts folder.');
                          }
                        }}
                      >
                        Save Draft
                      </Button>

                      <button
                        type="submit"
                        disabled={!replyText.trim()}
                        className="flex items-center gap-1.5 py-1.5 px-4 rounded-xl bg-[#2583E9] hover:bg-[#1768C4] disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-all"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Reply</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#6B7280]">
              <Mail className="w-12 h-12 text-slate-300 mb-3" />
              <p className="text-sm font-semibold text-[#202938]">No message selected</p>
              <p className="text-xs text-[#6B7280] mt-1">Select an email from the middle list to view details and reply.</p>
            </div>
          )}
        </div>
      </div>

      {/* Compose Message Modal */}
      <Modal
        isOpen={composeOpen}
        onClose={() => setComposeOpen(false)}
        title="Compose New Message"
        subtitle="Dispatch guest correspondence or internal hotel staff communication"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleComposeSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#202938] mb-1">Recipient *</label>
            <input
              type="text"
              required
              value={composeRecipient}
              onChange={(e) => setComposeRecipient(e.target.value)}
              placeholder="e.g. Sophia Montgomery or Front Desk Team"
              className="w-full text-xs p-2 rounded-lg border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9]"
              list="recipients-list"
            />
            <datalist id="recipients-list">
              {guests.map(g => (
                <option key={g.id} value={g.name}>{g.name} &lt;{g.email}&gt; (Guest)</option>
              ))}
              {staff.map(s => (
                <option key={s.id} value={s.name}>{s.name} ({s.role})</option>
              ))}
            </datalist>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#202938] mb-1">Message Category</label>
              <select
                value={composeCategory}
                onChange={(e) => setComposeCategory(e.target.value as MessageCategory)}
                className="w-full text-xs p-2 rounded-lg border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9]"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202938] mb-1">Sender Profile</label>
              <div className="text-xs p-2 rounded-lg border border-[#E7EBF0] bg-[#F8FAFC] text-[#202938] font-medium">
                {currentUser.name} ({currentUser.role})
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202938] mb-1">Subject Line *</label>
            <input
              type="text"
              required
              value={composeSubject}
              onChange={(e) => setComposeSubject(e.target.value)}
              placeholder="e.g. Confirmation of Airport Sedan Transfer"
              className="w-full text-xs p-2 rounded-lg border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202938] mb-1">Message Body *</label>
            <textarea
              rows={6}
              required
              value={composeBody}
              onChange={(e) => setComposeBody(e.target.value)}
              placeholder="Write your message here..."
              className="w-full text-xs p-3 rounded-lg border border-[#E7EBF0] focus:outline-none focus:border-[#2583E9]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button type="button" variant="outline" onClick={() => setComposeOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={<Send className="w-3.5 h-3.5" />}>
              Send Message
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
