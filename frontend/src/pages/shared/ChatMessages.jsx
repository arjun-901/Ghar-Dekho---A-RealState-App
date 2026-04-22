import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import axios from "axios";
import { HiChevronLeft, HiPaperAirplane, HiOutlineTrash, HiOutlineChatAlt2 } from "react-icons/hi";
const API_URL = import.meta.env.VITE_API_URL || "";

const ChatMessages = () => {
  const { user, token } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (token) axios.get(`${API_URL}/api/chat`, { headers: { Authorization: `Bearer ${token}` } }).then(res => { setChats(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (activeChat) {
      axios.get(`${API_URL}/api/chat/${activeChat._id}/messages`, { headers: { Authorization: `Bearer ${token}` } }).then(res => setMessages(res.data)).catch(() => {});
    }
  }, [activeChat]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const getChatPartner = (chat) => chat.buyer?._id === user._id ? chat.seller : chat.buyer;

  const handleSendMessage = async (e) => {
    e.preventDefault(); if (!newMessage.trim()) return;
    try {
      const res = await axios.post(`${API_URL}/api/chat/${activeChat._id}/message`, { text: newMessage }, { headers: { Authorization: `Bearer ${token}` } });
      setMessages([...messages, res.data]); setNewMessage("");
    } catch {}
  };

  const handleDeleteMessage = async (chatId, msgId) => {
    try { await axios.delete(`${API_URL}/api/chat/${chatId}/message/${msgId}`, { headers: { Authorization: `Bearer ${token}` } }); setMessages(messages.filter(m => m._id !== msgId)); } catch {}
  };

  if (loading) return <div className="loader-full-page"><div className="loader" /></div>;

  return (
    <div style={{ display: "flex", height: "100vh", paddingTop: user?.role === "seller" ? 0 : "72px" }}>
      {/* Sidebar */}
      <div style={{ width: "350px", borderRight: "1px solid #e2e8f0", background: "#fff", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "1.25rem", borderBottom: "1px solid #f1f5f9" }}><h2 style={{ margin: 0, fontSize: "1.25rem" }}>Messages</h2></div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {chats.length === 0 ? <div style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}>No conversations yet</div> :
            chats.map(chat => {
              const partner = getChatPartner(chat);
              return (
                <div key={chat._id} onClick={() => setActiveChat(chat)} style={{ padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", borderBottom: "1px solid #f8fafc", background: activeChat?._id === chat._id ? "#f0f9ff" : "transparent" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#0d9488", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, overflow: "hidden", flexShrink: 0 }}>
                    {partner?.profilePic ? <img src={partner.profilePic} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : partner?.name?.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{partner?.name}</div>
                    <div style={{ fontSize: "0.85rem", color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{chat.messages?.[chat.messages.length-1]?.text || "Start chatting..."}</div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#fff" }}>
        {activeChat ? (<>
          <div style={{ padding: "0.75rem 1.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button onClick={() => setActiveChat(null)} style={{ background: "#f1f5f9", border: "none", padding: "6px", borderRadius: "50%", cursor: "pointer", display: "flex" }}><HiChevronLeft size={20} /></button>
            <div style={{ fontWeight: 700 }}>{getChatPartner(activeChat)?.name}</div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem", background: "#f8fafc" }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ alignSelf: (msg.sender?._id || msg.sender) === user._id ? "flex-end" : "flex-start", maxWidth: "70%", padding: "0.75rem 1rem", borderRadius: "1.25rem", background: (msg.sender?._id || msg.sender) === user._id ? "#0d9488" : "#fff", color: (msg.sender?._id || msg.sender) === user._id ? "#fff" : "#334155", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
                  <span style={{ wordBreak: "break-word" }}>{msg.text}</span>
                  {(msg.sender?._id || msg.sender) === user._id && <button onClick={() => handleDeleteMessage(activeChat._id, msg._id)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", padding: 0, flexShrink: 0 }}><HiOutlineTrash size={14} /></button>}
                </div>
                <span style={{ fontSize: "0.7rem", opacity: 0.7, display: "block", marginTop: "4px" }}>{new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} style={{ padding: "1rem 1.5rem", borderTop: "1px solid #e2e8f0", display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type a message..." style={{ flex: 1, border: "1px solid #e2e8f0", borderRadius: "2rem", padding: "0.75rem 1.25rem", outline: "none" }} />
            <button type="submit" style={{ background: "#0d9488", color: "#fff", border: "none", width: 42, height: 42, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><HiPaperAirplane size={18} style={{ transform: "rotate(90deg)" }} /></button>
          </form>
        </>) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
            <HiOutlineChatAlt2 size={64} style={{ opacity: 0.5, marginBottom: "1rem" }} />
            <h3>Your Messages</h3><p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default ChatMessages;