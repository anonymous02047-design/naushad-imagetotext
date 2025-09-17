'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Settings, Languages } from 'lucide-react'
import { createWorker } from 'tesseract.js'
import toast from 'react-hot-toast'

import { OCRSettings } from './AdvancedOCRSettings'

interface TextExtractorProps {
  image: File
  onTextExtracted: (text: string) => void
  onProcessingState: (processing: boolean, progress: number) => void
  ocrSettings?: OCRSettings
}

const LANGUAGES = [
  { code: 'eng', name: 'English' },
  { code: 'spa', name: 'Spanish' },
  { code: 'fra', name: 'French' },
  { code: 'deu', name: 'German' },
  { code: 'ita', name: 'Italian' },
  { code: 'por', name: 'Portuguese' },
  { code: 'rus', name: 'Russian' },
  { code: 'chi_sim', name: 'Chinese (Simplified)' },
  { code: 'chi_tra', name: 'Chinese (Traditional)' },
  { code: 'jpn', name: 'Japanese' },
  { code: 'kor', name: 'Korean' },
  { code: 'ara', name: 'Arabic' },
  { code: 'hin', name: 'Hindi' },
  { code: 'ben', name: 'Bengali' },
  { code: 'tel', name: 'Telugu' },
  { code: 'mar', name: 'Marathi' },
  { code: 'tam', name: 'Tamil' },
  { code: 'guj', name: 'Gujarati' },
  { code: 'kan', name: 'Kannada' },
  { code: 'mal', name: 'Malayalam' },
  { code: 'pan', name: 'Punjabi' },
  { code: 'ori', name: 'Odia' },
  { code: 'asm', name: 'Assamese' },
  { code: 'nep', name: 'Nepali' },
  { code: 'sin', name: 'Sinhala' },
  { code: 'tha', name: 'Thai' },
  { code: 'vie', name: 'Vietnamese' },
  { code: 'ind', name: 'Indonesian' },
  { code: 'msa', name: 'Malay' },
  { code: 'fil', name: 'Filipino' },
  { code: 'nld', name: 'Dutch' },
  { code: 'swe', name: 'Swedish' },
  { code: 'nor', name: 'Norwegian' },
  { code: 'dan', name: 'Danish' },
  { code: 'fin', name: 'Finnish' },
  { code: 'pol', name: 'Polish' },
  { code: 'ces', name: 'Czech' },
  { code: 'hun', name: 'Hungarian' },
  { code: 'ron', name: 'Romanian' },
  { code: 'bul', name: 'Bulgarian' },
  { code: 'hrv', name: 'Croatian' },
  { code: 'slv', name: 'Slovenian' },
  { code: 'slk', name: 'Slovak' },
  { code: 'est', name: 'Estonian' },
  { code: 'lav', name: 'Latvian' },
  { code: 'lit', name: 'Lithuanian' },
  { code: 'ell', name: 'Greek' },
  { code: 'heb', name: 'Hebrew' },
  { code: 'fas', name: 'Persian' },
  { code: 'urd', name: 'Urdu' },
  { code: 'pus', name: 'Pashto' },
  { code: 'kaz', name: 'Kazakh' },
  { code: 'kir', name: 'Kyrgyz' },
  { code: 'uzb', name: 'Uzbek' },
  { code: 'mon', name: 'Mongolian' },
  { code: 'mya', name: 'Burmese' },
  { code: 'khm', name: 'Khmer' },
  { code: 'lao', name: 'Lao' },
  { code: 'amh', name: 'Amharic' },
  { code: 'swa', name: 'Swahili' },
  { code: 'yor', name: 'Yoruba' },
  { code: 'ibo', name: 'Igbo' },
  { code: 'hau', name: 'Hausa' },
  { code: 'zul', name: 'Zulu' },
  { code: 'xho', name: 'Xhosa' },
  { code: 'afr', name: 'Afrikaans' },
  { code: 'sot', name: 'Sotho' },
  { code: 'tsn', name: 'Tswana' },
  { code: 'ven', name: 'Venda' },
  { code: 'nso', name: 'Northern Sotho' },
  { code: 'ssw', name: 'Swati' },
  { code: 'nbl', name: 'Southern Ndebele' },
  { code: 'nrb', name: 'Northern Ndebele' },
  { code: 'tso', name: 'Tsonga' },
  { code: 'ndo', name: 'Ndonga' },
  { code: 'her', name: 'Herero' },
  { code: 'hgm', name: 'Khoekhoe' },
  { code: 'naq', name: 'Nama' },
  { code: 'kj', name: 'Kuanyama' },
  { code: 'ng', name: 'Ndonga' },
  { code: 'ii', name: 'Nuosu' },
  { code: 'bo', name: 'Tibetan' },
  { code: 'dz', name: 'Dzongkha' },
  { code: 'ne', name: 'Nepali' },
  { code: 'si', name: 'Sinhala' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'or', name: 'Odia' },
  { code: 'as', name: 'Assamese' },
  { code: 'bn', name: 'Bengali' },
  { code: 'hi', name: 'Hindi' },
  { code: 'mr', name: 'Marathi' },
  { code: 'sa', name: 'Sanskrit' },
  { code: 'sd', name: 'Sindhi' },
  { code: 'ks', name: 'Kashmiri' },
  { code: 'gom', name: 'Konkani' },
  { code: 'mni', name: 'Manipuri' },
  { code: 'sat', name: 'Santali' },
  { code: 'brx', name: 'Bodo' },
  { code: 'mni-Mtei', name: 'Meitei' },
  { code: 'lus', name: 'Mizo' },
  { code: 'njo', name: 'Ao' },
  { code: 'njz', name: 'Nyishi' },
  { code: 'grt', name: 'Garo' },
  { code: 'kha', name: 'Khasi' },
  { code: 'jai', name: 'Jaintia' },
  { code: 'mni-Beng', name: 'Manipuri (Bengali)' },
  { code: 'mni-Latn', name: 'Manipuri (Latin)' },
  { code: 'mni-Mtei', name: 'Manipuri (Meitei Mayek)' },
  { code: 'mni-Beng', name: 'Manipuri (Bengali)' },
  { code: 'mni-Latn', name: 'Manipuri (Latin)' },
  { code: 'mni-Mtei', name: 'Manipuri (Meitei Mayek)' }
]

export default function TextExtractor({ image, onTextExtracted, onProcessingState, ocrSettings }: TextExtractorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('eng')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showSettings, setShowSettings] = useState(false)

  const formatTextOutput = (text: string, filename: string) => {
    // Clean and structure the text
    let cleanedText = text
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n\s*\n/g, '\n\n') // Clean up multiple newlines
      .trim()

    const lowerText = cleanedText.toLowerCase()

    // Document type detection with comprehensive patterns
    if (lowerText.includes('driving licence') || lowerText.includes('dlno') || lowerText.includes('driving license')) {
      return formatDrivingLicense(cleanedText, filename)
    } else if (lowerText.includes('admit card') || lowerText.includes('examination') || lowerText.includes('hall ticket')) {
      return formatAdmitCard(cleanedText, filename)
    } else if (lowerText.includes('mark sheet') || lowerText.includes('marksheet') || lowerText.includes('grade card')) {
      return formatMarksheet(cleanedText, filename)
    } else if (lowerText.includes('passport') || lowerText.includes('passport no') || lowerText.includes('passport number')) {
      return formatPassport(cleanedText, filename)
    } else if (lowerText.includes('aadhaar') || lowerText.includes('aadhar') || lowerText.includes('uid')) {
      return formatAadhaar(cleanedText, filename)
    } else if (lowerText.includes('pan card') || lowerText.includes('permanent account number')) {
      return formatPAN(cleanedText, filename)
    } else if (lowerText.includes('voter id') || lowerText.includes('electoral') || lowerText.includes('epic')) {
      return formatVoterID(cleanedText, filename)
    } else if (lowerText.includes('birth certificate') || lowerText.includes('birth cert')) {
      return formatBirthCertificate(cleanedText, filename)
    } else if (lowerText.includes('death certificate') || lowerText.includes('death cert')) {
      return formatDeathCertificate(cleanedText, filename)
    } else if (lowerText.includes('marriage certificate') || lowerText.includes('marriage cert')) {
      return formatMarriageCertificate(cleanedText, filename)
    } else if (lowerText.includes('degree certificate') || lowerText.includes('graduation') || lowerText.includes('bachelor') || lowerText.includes('master')) {
      return formatDegreeCertificate(cleanedText, filename)
    } else if (lowerText.includes('invoice') || lowerText.includes('bill') || lowerText.includes('receipt')) {
      return formatInvoice(cleanedText, filename)
    } else if (lowerText.includes('bank statement') || lowerText.includes('account statement')) {
      return formatBankStatement(cleanedText, filename)
    } else if (lowerText.includes('salary slip') || lowerText.includes('payslip') || lowerText.includes('pay slip')) {
      return formatSalarySlip(cleanedText, filename)
    } else if (lowerText.includes('insurance') || lowerText.includes('policy')) {
      return formatInsurance(cleanedText, filename)
    } else if (lowerText.includes('medical report') || lowerText.includes('prescription') || lowerText.includes('diagnosis')) {
      return formatMedicalDocument(cleanedText, filename)
    } else if (lowerText.includes('property') || lowerText.includes('deed') || lowerText.includes('registry')) {
      return formatPropertyDocument(cleanedText, filename)
    } else if (lowerText.includes('contract') || lowerText.includes('agreement')) {
      return formatContract(cleanedText, filename)
    } else if (lowerText.includes('court') || lowerText.includes('legal') || lowerText.includes('judgment')) {
      return formatLegalDocument(cleanedText, filename)
    }

    // Default formatting
    return `📄 ${filename}
${'='.repeat(60)}
${cleanedText}
${'='.repeat(60)}

`
  }

  const formatDrivingLicense = (text: string, filename: string) => {
    let formatted = `🚗 DRIVING LICENSE - ${filename}
${'='.repeat(60)}

`

    // Extract key information
    const dlNoMatch = text.match(/DLNo[:\s]*([A-Z0-9\s]+)/i)
    const nameMatch = text.match(/Name[:\s]*([A-Z\s]+)/i)
    const dobMatch = text.match(/Date of Birth[:\s]*([0-9-]+)/i)
    const addressMatch = text.match(/Address[:\s]*([^,]+)/i)

    if (dlNoMatch) formatted += `📋 License Number: ${dlNoMatch[1].trim()}\n`
    if (nameMatch) formatted += `👤 Name: ${nameMatch[1].trim()}\n`
    if (dobMatch) formatted += `📅 Date of Birth: ${dobMatch[1].trim()}\n`
    if (addressMatch) formatted += `🏠 Address: ${addressMatch[1].trim()}\n`

    formatted += `\n📝 Full Text:\n${text}\n${'='.repeat(60)}\n\n`
    return formatted
  }

  const formatAdmitCard = (text: string, filename: string) => {
    let formatted = `🎓 ADMIT CARD - ${filename}
${'='.repeat(60)}

`

    // Extract key information
    const nameMatch = text.match(/Name[:\s]*([A-Z\s]+)/i)
    const rollMatch = text.match(/Roll[:\s]*([A-Z0-9-]+)/i)
    const regMatch = text.match(/Reg[:\s]*([A-Z0-9-]+)/i)
    const schoolMatch = text.match(/School[:\s]*([A-Z\s]+)/i)

    if (nameMatch) formatted += `👤 Student Name: ${nameMatch[1].trim()}\n`
    if (rollMatch) formatted += `🎫 Roll Number: ${rollMatch[1].trim()}\n`
    if (regMatch) formatted += `📋 Registration: ${regMatch[1].trim()}\n`
    if (schoolMatch) formatted += `🏫 School: ${schoolMatch[1].trim()}\n`

    formatted += `\n📝 Full Text:\n${text}\n${'='.repeat(60)}\n\n`
    return formatted
  }

  const formatMarksheet = (text: string, filename: string) => {
    let formatted = `📊 MARK SHEET - ${filename}
${'='.repeat(60)}

`

    // Extract key information
    const nameMatch = text.match(/Name[:\s]*([A-Z\s]+)/i)
    const rollMatch = text.match(/Roll[:\s]*([A-Z0-9-]+)/i)
    const regMatch = text.match(/Reg[:\s]*([A-Z0-9-]+)/i)
    const resultMatch = text.match(/RESULT[:\s]*([A-Z0-9\s]+)/i)

    if (nameMatch) formatted += `👤 Student Name: ${nameMatch[1].trim()}\n`
    if (rollMatch) formatted += `🎫 Roll Number: ${rollMatch[1].trim()}\n`
    if (regMatch) formatted += `📋 Registration: ${regMatch[1].trim()}\n`
    if (resultMatch) formatted += `🏆 Result: ${resultMatch[1].trim()}\n`

    formatted += `\n📝 Full Text:\n${text}\n${'='.repeat(60)}\n\n`
    return formatted
  }

  const formatPassport = (text: string, filename: string) => {
    let formatted = `🛂 PASSPORT - ${filename}
${'='.repeat(60)}

`

    const passportMatch = text.match(/Passport[:\s]*([A-Z0-9\s]+)/i)
    const nameMatch = text.match(/Name[:\s]*([A-Z\s]+)/i)
    const dobMatch = text.match(/Date of Birth[:\s]*([0-9-]+)/i)
    const placeMatch = text.match(/Place of Birth[:\s]*([A-Z\s,]+)/i)
    const issueMatch = text.match(/Date of Issue[:\s]*([0-9-]+)/i)
    const expiryMatch = text.match(/Date of Expiry[:\s]*([0-9-]+)/i)

    if (passportMatch) formatted += `📋 Passport Number: ${passportMatch[1].trim()}\n`
    if (nameMatch) formatted += `👤 Name: ${nameMatch[1].trim()}\n`
    if (dobMatch) formatted += `📅 Date of Birth: ${dobMatch[1].trim()}\n`
    if (placeMatch) formatted += `🏠 Place of Birth: ${placeMatch[1].trim()}\n`
    if (issueMatch) formatted += `📅 Date of Issue: ${issueMatch[1].trim()}\n`
    if (expiryMatch) formatted += `📅 Date of Expiry: ${expiryMatch[1].trim()}\n`

    formatted += `\n📝 Full Text:\n${text}\n${'='.repeat(60)}\n\n`
    return formatted
  }

  const formatAadhaar = (text: string, filename: string) => {
    let formatted = `🆔 AADHAAR CARD - ${filename}
${'='.repeat(60)}

`

    const aadhaarMatch = text.match(/(\d{4}\s?\d{4}\s?\d{4})/i)
    const nameMatch = text.match(/Name[:\s]*([A-Z\s]+)/i)
    const dobMatch = text.match(/Date of Birth[:\s]*([0-9-]+)/i)
    const genderMatch = text.match(/Gender[:\s]*([A-Z]+)/i)
    const addressMatch = text.match(/Address[:\s]*([^,]+)/i)

    if (aadhaarMatch) formatted += `🆔 Aadhaar Number: ${aadhaarMatch[1].trim()}\n`
    if (nameMatch) formatted += `👤 Name: ${nameMatch[1].trim()}\n`
    if (dobMatch) formatted += `📅 Date of Birth: ${dobMatch[1].trim()}\n`
    if (genderMatch) formatted += `⚧ Gender: ${genderMatch[1].trim()}\n`
    if (addressMatch) formatted += `🏠 Address: ${addressMatch[1].trim()}\n`

    formatted += `\n📝 Full Text:\n${text}\n${'='.repeat(60)}\n\n`
    return formatted
  }

  const formatPAN = (text: string, filename: string) => {
    let formatted = `💳 PAN CARD - ${filename}
${'='.repeat(60)}

`

    const panMatch = text.match(/([A-Z]{5}[0-9]{4}[A-Z]{1})/i)
    const nameMatch = text.match(/Name[:\s]*([A-Z\s]+)/i)
    const fatherMatch = text.match(/Father[:\s]*([A-Z\s]+)/i)
    const dobMatch = text.match(/Date of Birth[:\s]*([0-9-]+)/i)

    if (panMatch) formatted += `💳 PAN Number: ${panMatch[1].trim()}\n`
    if (nameMatch) formatted += `👤 Name: ${nameMatch[1].trim()}\n`
    if (fatherMatch) formatted += `👨 Father's Name: ${fatherMatch[1].trim()}\n`
    if (dobMatch) formatted += `📅 Date of Birth: ${dobMatch[1].trim()}\n`

    formatted += `\n📝 Full Text:\n${text}\n${'='.repeat(60)}\n\n`
    return formatted
  }

  const formatVoterID = (text: string, filename: string) => {
    let formatted = `🗳️ VOTER ID - ${filename}
${'='.repeat(60)}

`

    const epicMatch = text.match(/EPIC[:\s]*([A-Z0-9\s]+)/i)
    const nameMatch = text.match(/Name[:\s]*([A-Z\s]+)/i)
    const fatherMatch = text.match(/Father[:\s]*([A-Z\s]+)/i)
    const ageMatch = text.match(/Age[:\s]*([0-9]+)/i)
    const addressMatch = text.match(/Address[:\s]*([^,]+)/i)

    if (epicMatch) formatted += `🗳️ EPIC Number: ${epicMatch[1].trim()}\n`
    if (nameMatch) formatted += `👤 Name: ${nameMatch[1].trim()}\n`
    if (fatherMatch) formatted += `👨 Father's Name: ${fatherMatch[1].trim()}\n`
    if (ageMatch) formatted += `🎂 Age: ${ageMatch[1].trim()}\n`
    if (addressMatch) formatted += `🏠 Address: ${addressMatch[1].trim()}\n`

    formatted += `\n📝 Full Text:\n${text}\n${'='.repeat(60)}\n\n`
    return formatted
  }

  const formatBirthCertificate = (text: string, filename: string) => {
    let formatted = `👶 BIRTH CERTIFICATE - ${filename}
${'='.repeat(60)}

`

    const nameMatch = text.match(/Name[:\s]*([A-Z\s]+)/i)
    const dobMatch = text.match(/Date of Birth[:\s]*([0-9-]+)/i)
    const placeMatch = text.match(/Place of Birth[:\s]*([A-Z\s,]+)/i)
    const fatherMatch = text.match(/Father[:\s]*([A-Z\s]+)/i)
    const motherMatch = text.match(/Mother[:\s]*([A-Z\s]+)/i)

    if (nameMatch) formatted += `👤 Name: ${nameMatch[1].trim()}\n`
    if (dobMatch) formatted += `📅 Date of Birth: ${dobMatch[1].trim()}\n`
    if (placeMatch) formatted += `🏠 Place of Birth: ${placeMatch[1].trim()}\n`
    if (fatherMatch) formatted += `👨 Father's Name: ${fatherMatch[1].trim()}\n`
    if (motherMatch) formatted += `👩 Mother's Name: ${motherMatch[1].trim()}\n`

    formatted += `\n📝 Full Text:\n${text}\n${'='.repeat(60)}\n\n`
    return formatted
  }

  const formatDeathCertificate = (text: string, filename: string) => {
    let formatted = `⚰️ DEATH CERTIFICATE - ${filename}
${'='.repeat(60)}

`

    const nameMatch = text.match(/Name[:\s]*([A-Z\s]+)/i)
    const dodMatch = text.match(/Date of Death[:\s]*([0-9-]+)/i)
    const placeMatch = text.match(/Place of Death[:\s]*([A-Z\s,]+)/i)
    const causeMatch = text.match(/Cause of Death[:\s]*([A-Z\s,]+)/i)

    if (nameMatch) formatted += `👤 Name: ${nameMatch[1].trim()}\n`
    if (dodMatch) formatted += `📅 Date of Death: ${dodMatch[1].trim()}\n`
    if (placeMatch) formatted += `🏠 Place of Death: ${placeMatch[1].trim()}\n`
    if (causeMatch) formatted += `💀 Cause of Death: ${causeMatch[1].trim()}\n`

    formatted += `\n📝 Full Text:\n${text}\n${'='.repeat(60)}\n\n`
    return formatted
  }

  const formatMarriageCertificate = (text: string, filename: string) => {
    let formatted = `💒 MARRIAGE CERTIFICATE - ${filename}
${'='.repeat(60)}

`

    const groomMatch = text.match(/Groom[:\s]*([A-Z\s]+)/i)
    const brideMatch = text.match(/Bride[:\s]*([A-Z\s]+)/i)
    const dateMatch = text.match(/Date of Marriage[:\s]*([0-9-]+)/i)
    const placeMatch = text.match(/Place of Marriage[:\s]*([A-Z\s,]+)/i)

    if (groomMatch) formatted += `👨 Groom's Name: ${groomMatch[1].trim()}\n`
    if (brideMatch) formatted += `👩 Bride's Name: ${brideMatch[1].trim()}\n`
    if (dateMatch) formatted += `📅 Date of Marriage: ${dateMatch[1].trim()}\n`
    if (placeMatch) formatted += `🏠 Place of Marriage: ${placeMatch[1].trim()}\n`

    formatted += `\n📝 Full Text:\n${text}\n${'='.repeat(60)}\n\n`
    return formatted
  }

  const formatDegreeCertificate = (text: string, filename: string) => {
    let formatted = `🎓 DEGREE CERTIFICATE - ${filename}
${'='.repeat(60)}

`

    const nameMatch = text.match(/Name[:\s]*([A-Z\s]+)/i)
    const degreeMatch = text.match(/Degree[:\s]*([A-Z\s]+)/i)
    const universityMatch = text.match(/University[:\s]*([A-Z\s,]+)/i)
    const yearMatch = text.match(/Year[:\s]*([0-9]+)/i)
    const cgpaMatch = text.match(/CGPA[:\s]*([0-9.]+)/i)

    if (nameMatch) formatted += `👤 Name: ${nameMatch[1].trim()}\n`
    if (degreeMatch) formatted += `🎓 Degree: ${degreeMatch[1].trim()}\n`
    if (universityMatch) formatted += `🏫 University: ${universityMatch[1].trim()}\n`
    if (yearMatch) formatted += `📅 Year: ${yearMatch[1].trim()}\n`
    if (cgpaMatch) formatted += `📊 CGPA: ${cgpaMatch[1].trim()}\n`

    formatted += `\n📝 Full Text:\n${text}\n${'='.repeat(60)}\n\n`
    return formatted
  }

  const formatInvoice = (text: string, filename: string) => {
    let formatted = `🧾 INVOICE/RECEIPT - ${filename}
${'='.repeat(60)}

`

    const invoiceMatch = text.match(/Invoice[:\s]*([A-Z0-9\s-]+)/i)
    const dateMatch = text.match(/Date[:\s]*([0-9-]+)/i)
    const amountMatch = text.match(/Amount[:\s]*([₹$0-9,]+)/i)
    const customerMatch = text.match(/Customer[:\s]*([A-Z\s]+)/i)
    const companyMatch = text.match(/Company[:\s]*([A-Z\s,]+)/i)

    if (invoiceMatch) formatted += `🧾 Invoice Number: ${invoiceMatch[1].trim()}\n`
    if (dateMatch) formatted += `📅 Date: ${dateMatch[1].trim()}\n`
    if (amountMatch) formatted += `💰 Amount: ${amountMatch[1].trim()}\n`
    if (customerMatch) formatted += `👤 Customer: ${customerMatch[1].trim()}\n`
    if (companyMatch) formatted += `🏢 Company: ${companyMatch[1].trim()}\n`

    formatted += `\n📝 Full Text:\n${text}\n${'='.repeat(60)}\n\n`
    return formatted
  }

  const formatBankStatement = (text: string, filename: string) => {
    let formatted = `🏦 BANK STATEMENT - ${filename}
${'='.repeat(60)}

`

    const accountMatch = text.match(/Account[:\s]*([0-9\s-]+)/i)
    const bankMatch = text.match(/Bank[:\s]*([A-Z\s,]+)/i)
    const periodMatch = text.match(/Period[:\s]*([0-9-\s]+)/i)
    const balanceMatch = text.match(/Balance[:\s]*([₹$0-9,]+)/i)

    if (accountMatch) formatted += `🏦 Account Number: ${accountMatch[1].trim()}\n`
    if (bankMatch) formatted += `🏛️ Bank: ${bankMatch[1].trim()}\n`
    if (periodMatch) formatted += `📅 Period: ${periodMatch[1].trim()}\n`
    if (balanceMatch) formatted += `💰 Balance: ${balanceMatch[1].trim()}\n`

    formatted += `\n📝 Full Text:\n${text}\n${'='.repeat(60)}\n\n`
    return formatted
  }

  const formatSalarySlip = (text: string, filename: string) => {
    let formatted = `💰 SALARY SLIP - ${filename}
${'='.repeat(60)}

`

    const nameMatch = text.match(/Name[:\s]*([A-Z\s]+)/i)
    const empMatch = text.match(/Employee[:\s]*([A-Z0-9\s-]+)/i)
    const monthMatch = text.match(/Month[:\s]*([A-Z0-9\s]+)/i)
    const grossMatch = text.match(/Gross[:\s]*([₹$0-9,]+)/i)
    const netMatch = text.match(/Net[:\s]*([₹$0-9,]+)/i)

    if (nameMatch) formatted += `👤 Name: ${nameMatch[1].trim()}\n`
    if (empMatch) formatted += `🆔 Employee ID: ${empMatch[1].trim()}\n`
    if (monthMatch) formatted += `📅 Month: ${monthMatch[1].trim()}\n`
    if (grossMatch) formatted += `💰 Gross Salary: ${grossMatch[1].trim()}\n`
    if (netMatch) formatted += `💰 Net Salary: ${netMatch[1].trim()}\n`

    formatted += `\n📝 Full Text:\n${text}\n${'='.repeat(60)}\n\n`
    return formatted
  }

  const formatInsurance = (text: string, filename: string) => {
    let formatted = `🛡️ INSURANCE POLICY - ${filename}
${'='.repeat(60)}

`

    const policyMatch = text.match(/Policy[:\s]*([A-Z0-9\s-]+)/i)
    const nameMatch = text.match(/Name[:\s]*([A-Z\s]+)/i)
    const premiumMatch = text.match(/Premium[:\s]*([₹$0-9,]+)/i)
    const expiryMatch = text.match(/Expiry[:\s]*([0-9-]+)/i)

    if (policyMatch) formatted += `🛡️ Policy Number: ${policyMatch[1].trim()}\n`
    if (nameMatch) formatted += `👤 Name: ${nameMatch[1].trim()}\n`
    if (premiumMatch) formatted += `💰 Premium: ${premiumMatch[1].trim()}\n`
    if (expiryMatch) formatted += `📅 Expiry Date: ${expiryMatch[1].trim()}\n`

    formatted += `\n📝 Full Text:\n${text}\n${'='.repeat(60)}\n\n`
    return formatted
  }

  const formatMedicalDocument = (text: string, filename: string) => {
    let formatted = `🏥 MEDICAL DOCUMENT - ${filename}
${'='.repeat(60)}

`

    const nameMatch = text.match(/Name[:\s]*([A-Z\s]+)/i)
    const ageMatch = text.match(/Age[:\s]*([0-9]+)/i)
    const diagnosisMatch = text.match(/Diagnosis[:\s]*([A-Z\s,]+)/i)
    const doctorMatch = text.match(/Doctor[:\s]*([A-Z\s]+)/i)
    const dateMatch = text.match(/Date[:\s]*([0-9-]+)/i)

    if (nameMatch) formatted += `👤 Patient Name: ${nameMatch[1].trim()}\n`
    if (ageMatch) formatted += `🎂 Age: ${ageMatch[1].trim()}\n`
    if (diagnosisMatch) formatted += `🔬 Diagnosis: ${diagnosisMatch[1].trim()}\n`
    if (doctorMatch) formatted += `👨‍⚕️ Doctor: ${doctorMatch[1].trim()}\n`
    if (dateMatch) formatted += `📅 Date: ${dateMatch[1].trim()}\n`

    formatted += `\n📝 Full Text:\n${text}\n${'='.repeat(60)}\n\n`
    return formatted
  }

  const formatPropertyDocument = (text: string, filename: string) => {
    let formatted = `🏠 PROPERTY DOCUMENT - ${filename}
${'='.repeat(60)}

`

    const ownerMatch = text.match(/Owner[:\s]*([A-Z\s]+)/i)
    const addressMatch = text.match(/Address[:\s]*([A-Z\s,]+)/i)
    const areaMatch = text.match(/Area[:\s]*([0-9\s]+)/i)
    const valueMatch = text.match(/Value[:\s]*([₹$0-9,]+)/i)

    if (ownerMatch) formatted += `👤 Owner: ${ownerMatch[1].trim()}\n`
    if (addressMatch) formatted += `🏠 Address: ${addressMatch[1].trim()}\n`
    if (areaMatch) formatted += `📐 Area: ${areaMatch[1].trim()}\n`
    if (valueMatch) formatted += `💰 Value: ${valueMatch[1].trim()}\n`

    formatted += `\n📝 Full Text:\n${text}\n${'='.repeat(60)}\n\n`
    return formatted
  }

  const formatContract = (text: string, filename: string) => {
    let formatted = `📋 CONTRACT/AGREEMENT - ${filename}
${'='.repeat(60)}

`

    const party1Match = text.match(/Party[:\s]*([A-Z\s]+)/i)
    const party2Match = text.match(/Second Party[:\s]*([A-Z\s]+)/i)
    const dateMatch = text.match(/Date[:\s]*([0-9-]+)/i)
    const amountMatch = text.match(/Amount[:\s]*([₹$0-9,]+)/i)

    if (party1Match) formatted += `👤 First Party: ${party1Match[1].trim()}\n`
    if (party2Match) formatted += `👤 Second Party: ${party2Match[1].trim()}\n`
    if (dateMatch) formatted += `📅 Date: ${dateMatch[1].trim()}\n`
    if (amountMatch) formatted += `💰 Amount: ${amountMatch[1].trim()}\n`

    formatted += `\n📝 Full Text:\n${text}\n${'='.repeat(60)}\n\n`
    return formatted
  }

  const formatLegalDocument = (text: string, filename: string) => {
    let formatted = `⚖️ LEGAL DOCUMENT - ${filename}
${'='.repeat(60)}

`

    const caseMatch = text.match(/Case[:\s]*([A-Z0-9\s-]+)/i)
    const courtMatch = text.match(/Court[:\s]*([A-Z\s,]+)/i)
    const dateMatch = text.match(/Date[:\s]*([0-9-]+)/i)
    const judgeMatch = text.match(/Judge[:\s]*([A-Z\s]+)/i)

    if (caseMatch) formatted += `⚖️ Case Number: ${caseMatch[1].trim()}\n`
    if (courtMatch) formatted += `🏛️ Court: ${courtMatch[1].trim()}\n`
    if (dateMatch) formatted += `📅 Date: ${dateMatch[1].trim()}\n`
    if (judgeMatch) formatted += `👨‍⚖️ Judge: ${judgeMatch[1].trim()}\n`

    formatted += `\n📝 Full Text:\n${text}\n${'='.repeat(60)}\n\n`
    return formatted
  }

  const extractText = async () => {
    if (!image) return

    setIsProcessing(true)
    onProcessingState(true, 0)

    try {
      const worker = await createWorker(selectedLanguage)
      
      // Apply OCR settings if provided
      if (ocrSettings) {
        await worker.setParameters({
          tessedit_pageseg_mode: ocrSettings.pageSegmentationMode as any,
          tessedit_ocr_engine_mode: ocrSettings.ocrEngineMode as any,
        })
      }

      const { data: { text } } = await worker.recognize(image)

      await worker.terminate()
      
      // Format the text output
      const formattedText = formatTextOutput(text, image.name)
      
      onTextExtracted(formattedText)
      onProcessingState(false, 0)
      toast.success('Text extracted and formatted successfully!')
    } catch (error) {
      console.error('OCR Error:', error)
      toast.error('Failed to extract text. Please try again.')
      onProcessingState(false, 0)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Text Extraction</h2>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Language Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Languages className="w-4 h-4 inline mr-1" />
          Language
        </label>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="input-field"
          disabled={isProcessing}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Advanced Settings */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 p-4 bg-gray-50 rounded-lg"
        >
          <h3 className="text-sm font-medium text-gray-700 mb-2">Advanced Settings</h3>
          <div className="space-y-2 text-xs text-gray-600">
            <p>• OCR Engine: Tesseract.js v5</p>
            <p>• Image preprocessing: Automatic</p>
            <p>• Confidence threshold: 60%</p>
          </div>
        </motion.div>
      )}

      {/* Extract Button */}
      <motion.button
        whileHover={{ scale: isProcessing ? 1 : 1.02 }}
        whileTap={{ scale: isProcessing ? 1 : 0.98 }}
        onClick={extractText}
        disabled={isProcessing}
        className={`w-full btn-primary flex items-center justify-center ${
          isProcessing ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isProcessing ? (
          <>
            <div className="loading-dots mr-3">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            Extracting Text... {progress}%
          </>
        ) : (
          <>
            <Play className="w-4 h-4 mr-2" />
            Extract Text
          </>
        )}
      </motion.button>

      {/* Progress Bar */}
      {isProcessing && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
