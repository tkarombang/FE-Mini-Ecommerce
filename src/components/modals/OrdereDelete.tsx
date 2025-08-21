import React from "react";

type OrderDeleteModalProps = {
  orderId: number;
  onDelete: (id: number) => void;
  onCancel: () => void;
};

const DeleteModal: React.FC<OrderDeleteModalProps> = ({ orderId, onDelete, onCancel }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center space-y-6">
      <h3 className="text-2xl font-bold text-red-600">Confirm Delete ● ● ●</h3>
      <p className="text-gray-700">Apakah Anda yakin ingin menghapus pesanan ini?</p>
      <div className="flex gap-4 justify-center mt-6">
        <button onClick={() => onDelete(orderId)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors">
          Ya, Hapus
        </button>
        <button onClick={onCancel} className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors">
          Batal
        </button>
      </div>
    </div>
  </div>
);
export default DeleteModal;
