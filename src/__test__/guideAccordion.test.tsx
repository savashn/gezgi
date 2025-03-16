// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import GuideAccordion from '@/components/accordions/GuideAccordion';
// import '@testing-library/jest-dom';

// const mockGuide = {
//     id: 1,
//     name: "Test Guide",
//     username: "testguide",
//     email: "test@example.com",
//     phone: "1234567890",
//     passportNo: "A123456",
//     birth: "1990-01-01",
//     intimate: "Test Intimate",
//     intimacy: "Brother",
//     intimatePhone: "0987654321",
//     isAdmin: false,
//     languageId: 1,
//     language: "Turkish",
//     nationalityId: 1,
//     nationality: "Turkey"
// };

// const mockLanguages = [
//     { id: 1, language: "Türkçe" },
//     { id: 2, language: "İngilizce" }
// ];

// const mockNationalities = [
//     { id: 1, nationality: "Türk" },
//     { id: 2, nationality: "İngiliz" }
// ];

// describe('GuideAccordion Bileşeni', () => {
//     const mockProps = {
//         data: [mockGuide],
//         api: "http://test-api.com",
//         token: "test-token",
//         languages: mockLanguages,
//         nationalities: mockNationalities
//     };

//     test('rehber bilgilerini doğru şekilde gösteriyor', () => {
//         render(<GuideAccordion {...mockProps} />);

//         expect(screen.getByText(mockGuide.name)).toBeInTheDocument();
//         expect(screen.getByText(mockGuide.email)).toBeInTheDocument();
//         expect(screen.getByText(mockGuide.phone)).toBeInTheDocument();
//     });

//     test('düzenleme moduna geçiyor', async () => {
//         render(<GuideAccordion {...mockProps} />);

//         // Accordion'u aç
//         const accordionTrigger = screen.getByText(mockGuide.name);
//         fireEvent.click(accordionTrigger);

//         // Düzenle butonuna tıkla
//         const editButton = screen.getByText('Edit Guide');
//         fireEvent.click(editButton);

//         // Input alanlarının görünür olduğunu kontrol et
//         await waitFor(() => {
//             expect(screen.getByDisplayValue(mockGuide.name)).toBeInTheDocument();
//             expect(screen.getByDisplayValue(mockGuide.email)).toBeInTheDocument();
//             expect(screen.getByDisplayValue(mockGuide.phone)).toBeInTheDocument();
//         });

//         // Kaydet ve İptal butonlarının görünür olduğunu kontrol et
//         expect(screen.getByText('Kaydet')).toBeInTheDocument();
//         expect(screen.getByText('İptal')).toBeInTheDocument();
//     });

//     test('düzenleme modundan çıkıyor', async () => {
//         render(<GuideAccordion {...mockProps} />);

//         // Accordion'u aç
//         fireEvent.click(screen.getByText(mockGuide.name));

//         // Düzenleme moduna geç
//         fireEvent.click(screen.getByText('Edit Guide'));

//         // İptal butonuna tıkla
//         const cancelButton = screen.getByText('Cancel');
//         fireEvent.click(cancelButton);

//         // Düzenleme modundan çıktığını kontrol et
//         await waitFor(() => {
//             expect(screen.queryByText('Save')).not.toBeInTheDocument();
//             expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
//             expect(screen.getByText('Edit Guide')).toBeInTheDocument();
//         });
//     });
// });
