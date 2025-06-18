'use client';

import { useState } from 'react';

export default function CreateGatheringForm() {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: 5,
    type: 'OFFICE_STRETCHING',
    image: null as File | null,
    dateTime: '',
    registrationEnd: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('폼 데이터:', formData);
    // TODO: API 요청 연동 예정
  };

  return (
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
      <div className="flex items-center gap-3">
        <input
            type="text"
            disabled
            placeholder="이미지를 첨부해주세요"
            value={formData.image?.name || ''}
            className="w-full border border-gray-200 rounded-md px-4 py-3 text-gray-400 bg-gray-50"
        />
        <label
            className="shrink-0 text-sm text-orange-500 border border-orange-500 px-3 py-2 rounded-md cursor-pointer hover:bg-orange-50 transition whitespace-nowrap"
        >
            파일 찾기
            <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            />
        </label>
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
              onClick={() =>
                setFormData((prev) => ({ ...prev, type: key }))
              }
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
  );
}
