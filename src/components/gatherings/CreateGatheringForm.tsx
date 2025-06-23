'use client';

import { useState } from 'react';
import { useCreateGathering } from '@/hooks/api/useCreateGathering';
import { useAuth } from '@/providers/AuthProvider';
import Dialog from '@/components/shared/ui/Dialog';

export default function CreateGatheringForm({ onClose }: { onClose: () => void }) {
  const { token } = useAuth();
  const { mutate: createGathering } = useCreateGathering(token ?? '');

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: 5,
    type: 'OFFICE_STRETCHING',
    image: null as File | null,
    dateTime: '',
    registrationEnd: '',
  });

  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  if (!token) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'capacity' ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image) {
      setDialogMessage('이미지를 첨부해주세요.');
      setShowDialog(true);
      return;
    }

    if (formData.capacity < 5) {
      setDialogMessage('모집 정원은 최소 5명 이상이어야 합니다.');
      setShowDialog(true);
      return;
    }

    createGathering(
      {
        type: formData.type,
        name: formData.name,
        location: formData.location,
        dateTime: new Date(formData.dateTime).toISOString(),
        registrationEnd: new Date(formData.registrationEnd).toISOString(),
        capacity: formData.capacity,
        image: formData.image,
      },
      {
        onSuccess: () => {
          setDialogMessage('모임이 성공적으로 생성되었습니다!');
          setShowDialog(true);
        },
        onError: () => {
          setDialogMessage('모임 생성 중 오류가 발생했습니다.');
          setShowDialog(true);
        },
      }
    );
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    // 성공 메시지일 경우 폼도 닫아 줍니다
    if (dialogMessage === '모임이 성공적으로 생성되었습니다!') {
      onClose();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 text-sm">
        {/* 모임 이름 */}
        <div>
          <label className="block font-medium mb-2">모임 이름</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="모임 이름을 작성해주세요"
            className="w-full border border-gray-200 rounded-md px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        {/* 장소 */}
        <div>
          <label className="block font-medium mb-2">장소</label>
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-md px-4 py-3 placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            <option value="">장소를 선택해주세요</option>
            <option value="건대입구">건대입구</option>
            <option value="신림">신림</option>
            <option value="홍대입구">홍대입구</option>
            <option value="을지로3가">을지로3가</option>
          </select>
        </div>

        {/* 이미지 */}
        <div>
          <label className="block font-medium mb-2">이미지</label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              disabled
              placeholder="이미지를 첨부해주세요"
              value={formData.image?.name || ''}
              className="w-full border border-gray-200 rounded-md px-4 py-3 text-gray-400 bg-gray-50"
            />
            <label className="shrink-0 text-sm text-orange-500 border border-orange-500 px-3 py-2 rounded-md cursor-pointer hover:bg-orange-50 transition whitespace-nowrap">
              파일 찾기
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* 선택 서비스 */}
        <div>
          <label className="block font-medium mb-2">선택 서비스</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: 'OFFICE_STRETCHING', label: '달램핏', sub: '오피스 스트레칭' },
              { key: 'MINDFULNESS', label: '달램핏', sub: '마인드풀니스' },
              { key: 'WORKATION', label: '워케이션', sub: '' },
            ].map(({ key, label, sub }) => (
              <button
                key={key}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, type: key }))}
                className={`border rounded-md p-3 text-left transition ${
                  formData.type === key
                    ? 'bg-black text-white border-black'
                    : 'bg-gray-50 text-gray-800 border-gray-200'
                }`}
              >
                <div className="font-semibold">{label}</div>
                {sub && <div className="text-xs text-gray-400">{sub}</div>}
              </button>
            ))}
          </div>
        </div>

        {/* 날짜 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2">모임 날짜</label>
            <input
              type="datetime-local"
              name="dateTime"
              value={formData.dateTime}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block font-medium mb-2">마감 날짜</label>
            <input
              type="datetime-local"
              name="registrationEnd"
              value={formData.registrationEnd}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* 모집 정원 */}
        <div>
          <label className="block font-medium mb-2">모집 정원</label>
          <input
            type="number"
            name="capacity"
            min={5}
            value={formData.capacity}
            onChange={handleChange}
            placeholder="최소 5인 이상 입력해주세요."
            className="w-full border border-gray-200 rounded-md px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        {/* 확인 버튼 */}
        <button
          type="submit"
          className="w-full bg-gray-300 text-white font-semibold py-3 rounded-md disabled:opacity-50 hover:bg-gray-400 transition"
          disabled={!formData.name || !formData.location || !formData.dateTime}
        >
          확인
        </button>
      </form>

      {showDialog && (
        <Dialog onClose={handleDialogClose}>
          <div className="flex flex-col items-center justify-center py-6 px-4">
            <p className="text-center text-base font-semibold mb-4">
              {dialogMessage}
            </p>
            <button
              className="bg-orange-500 text-white px-6 py-2 rounded-lg"
              onClick={handleDialogClose}
            >
              확인
            </button>
          </div>
        </Dialog>
      )}
    </>
  );
}
