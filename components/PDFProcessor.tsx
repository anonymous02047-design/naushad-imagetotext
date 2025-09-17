'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { FileText, Upload, Download, AlertCircle, CheckCircle } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'

interface PDFProcessorProps {
  onTextExtracted: (text: string, filename: string) => void
}

export default function PDFProcessor({ onTextExtracted }: PDFProcessorProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedFiles, setProcessedFiles] = useState<Array<{
    name: string
    text: string
    status: 'success' | 'error'
  }>>([])

  // Advanced Document Analysis System
  const analyzeDocument = (text: string, filename: string) => {
    const lowerText = text.toLowerCase()
    
    // Document type detection with confidence scoring
    const documentTypes = [
      {
        type: 'driving_license',
        patterns: ['driving licence', 'dlno', 'driving license', 'dl no', 'license no'],
        confidence: 0
      },
      {
        type: 'admit_card',
        patterns: ['admit card', 'examination', 'hall ticket', 'exam card', 'hall ticket'],
        confidence: 0
      },
      {
        type: 'marksheet',
        patterns: ['mark sheet', 'marksheet', 'grade card', 'result', 'academic record'],
        confidence: 0
      },
      {
        type: 'passport',
        patterns: ['passport', 'passport no', 'passport number', 'passport no.'],
        confidence: 0
      },
      {
        type: 'aadhaar',
        patterns: ['aadhaar', 'aadhar', 'uid', 'unique identification'],
        confidence: 0
      },
      {
        type: 'pan_card',
        patterns: ['pan card', 'permanent account number', 'pan no', 'pan number'],
        confidence: 0
      },
      {
        type: 'voter_id',
        patterns: ['voter id', 'electoral', 'epic', 'voter card', 'electoral roll'],
        confidence: 0
      },
      {
        type: 'birth_certificate',
        patterns: ['birth certificate', 'birth cert', 'birth cert.', 'date of birth'],
        confidence: 0
      },
      {
        type: 'death_certificate',
        patterns: ['death certificate', 'death cert', 'death cert.', 'date of death'],
        confidence: 0
      },
      {
        type: 'marriage_certificate',
        patterns: ['marriage certificate', 'marriage cert', 'marriage cert.', 'wedding certificate'],
        confidence: 0
      },
      {
        type: 'degree_certificate',
        patterns: ['degree certificate', 'graduation', 'bachelor', 'master', 'phd', 'diploma', 'university'],
        confidence: 0
      },
      {
        type: 'invoice',
        patterns: ['invoice', 'bill', 'receipt', 'payment', 'amount', 'total', 'subtotal'],
        confidence: 0
      },
      {
        type: 'bank_statement',
        patterns: ['bank statement', 'account statement', 'banking', 'transaction', 'balance'],
        confidence: 0
      },
      {
        type: 'salary_slip',
        patterns: ['salary slip', 'payslip', 'pay slip', 'salary', 'wages', 'employee'],
        confidence: 0
      },
      {
        type: 'insurance',
        patterns: ['insurance', 'policy', 'premium', 'coverage', 'claim'],
        confidence: 0
      },
      {
        type: 'medical_document',
        patterns: ['medical report', 'prescription', 'diagnosis', 'doctor', 'patient', 'hospital'],
        confidence: 0
      },
      {
        type: 'property_document',
        patterns: ['property', 'deed', 'registry', 'land', 'house', 'real estate'],
        confidence: 0
      },
      {
        type: 'contract',
        patterns: ['contract', 'agreement', 'terms', 'conditions', 'party'],
        confidence: 0
      },
      {
        type: 'legal_document',
        patterns: ['court', 'legal', 'judgment', 'case', 'law', 'attorney'],
        confidence: 0
      }
    ]

    // Calculate confidence scores
    documentTypes.forEach(docType => {
      docType.patterns.forEach(pattern => {
        if (lowerText.includes(pattern)) {
          docType.confidence += 1
        }
      })
    })

    // Sort by confidence and get the most likely document type
    const sortedTypes = documentTypes.sort((a, b) => b.confidence - a.confidence)
    const detectedType = sortedTypes[0].confidence > 0 ? sortedTypes[0].type : 'unknown'

    return { detectedType, confidence: sortedTypes[0].confidence, allTypes: sortedTypes }
  }

  // Universal Field Extractor
  const extractUniversalFields = (text: string) => {
    const fields = {
      // Personal Information
      name: extractField(text, ['name', 'full name', 'applicant name', 'holder name', 'student name', 'patient name']),
      fatherName: extractField(text, ['father', 'father name', 'father\'s name', 'fathers name']),
      motherName: extractField(text, ['mother', 'mother name', 'mother\'s name', 'mothers name']),
      dateOfBirth: extractField(text, ['date of birth', 'dob', 'birth date', 'born on']),
      gender: extractField(text, ['gender', 'sex', 'male', 'female']),
      age: extractField(text, ['age', 'years old']),
      
      // Contact Information
      address: extractField(text, ['address', 'residence', 'permanent address', 'current address']),
      phone: extractField(text, ['phone', 'mobile', 'contact', 'telephone', 'cell']),
      email: extractField(text, ['email', 'e-mail', 'mail']),
      
      // Identification Numbers
      idNumber: extractField(text, ['id', 'number', 'no', 'id no', 'number']),
      rollNumber: extractField(text, ['roll', 'roll no', 'roll number', 'student id']),
      registrationNumber: extractField(text, ['registration', 'reg no', 'reg number', 'registration no']),
      
      // Dates
      issueDate: extractField(text, ['issue date', 'issued on', 'date of issue', 'issued']),
      expiryDate: extractField(text, ['expiry', 'expires', 'valid until', 'expiry date']),
      date: extractField(text, ['date', 'dated', 'on']),
      
      // Financial Information
      amount: extractField(text, ['amount', 'total', 'sum', 'value', 'price', 'cost']),
      balance: extractField(text, ['balance', 'remaining', 'outstanding']),
      salary: extractField(text, ['salary', 'wages', 'income', 'pay']),
      
      // Academic Information
      degree: extractField(text, ['degree', 'course', 'program', 'qualification']),
      university: extractField(text, ['university', 'college', 'institute', 'school']),
      year: extractField(text, ['year', 'session', 'academic year']),
      result: extractField(text, ['result', 'grade', 'marks', 'score', 'cgpa']),
      
      // Medical Information
      diagnosis: extractField(text, ['diagnosis', 'condition', 'disease', 'illness']),
      doctor: extractField(text, ['doctor', 'physician', 'dr.', 'medical officer']),
      
      // Legal Information
      caseNumber: extractField(text, ['case', 'case no', 'case number', 'file no']),
      court: extractField(text, ['court', 'tribunal', 'judge']),
      
      // Other
      place: extractField(text, ['place', 'location', 'venue', 'city', 'state']),
      purpose: extractField(text, ['purpose', 'reason', 'objective', 'aim']),
      status: extractField(text, ['status', 'state', 'condition', 'position'])
    }

    return fields
  }

  // Helper function to extract field values using multiple patterns
  const extractField = (text: string, patterns: string[]) => {
    for (const pattern of patterns) {
      const regex = new RegExp(`${pattern}[\\s:]*([^\\n\\r,]+)`, 'gi')
      const match = text.match(regex)
      if (match) {
        const value = match[0].replace(new RegExp(pattern, 'gi'), '').replace(/[:\s]+/, '').trim()
        if (value && value.length > 1) {
          return value
        }
      }
    }
    return null
  }

  const formatTextOutput = (text: string, filename: string) => {
    // Clean and structure the text
    let cleanedText = text
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n\s*\n/g, '\n\n') // Clean up multiple newlines
      .trim()

    // Analyze document type
    const analysis = analyzeDocument(cleanedText, filename)
    const detectedType = analysis.detectedType
    const confidence = analysis.confidence

    // Extract universal fields
    const extractedFields = extractUniversalFields(cleanedText)

    // Generate structured output based on detected type
    if (detectedType !== 'unknown' && confidence > 0) {
      return generateStructuredOutput(cleanedText, filename, detectedType, extractedFields, confidence)
    } else {
      // Fallback to universal structured output
      return generateUniversalStructuredOutput(cleanedText, filename, extractedFields)
    }
  }

  // Generate structured output for detected document types
  const generateStructuredOutput = (text: string, filename: string, docType: string, fields: any, confidence: number) => {
    const typeEmojis: { [key: string]: string } = {
      driving_license: '🚗',
      admit_card: '🎓',
      marksheet: '📊',
      passport: '🛂',
      aadhaar: '🆔',
      pan_card: '💳',
      voter_id: '🗳️',
      birth_certificate: '👶',
      death_certificate: '⚰️',
      marriage_certificate: '💒',
      degree_certificate: '🎓',
      invoice: '🧾',
      bank_statement: '🏦',
      salary_slip: '💰',
      insurance: '🛡️',
      medical_document: '🏥',
      property_document: '🏠',
      contract: '📋',
      legal_document: '⚖️'
    }

    const typeNames: { [key: string]: string } = {
      driving_license: 'DRIVING LICENSE',
      admit_card: 'ADMIT CARD',
      marksheet: 'MARK SHEET',
      passport: 'PASSPORT',
      aadhaar: 'AADHAAR CARD',
      pan_card: 'PAN CARD',
      voter_id: 'VOTER ID',
      birth_certificate: 'BIRTH CERTIFICATE',
      death_certificate: 'DEATH CERTIFICATE',
      marriage_certificate: 'MARRIAGE CERTIFICATE',
      degree_certificate: 'DEGREE CERTIFICATE',
      invoice: 'INVOICE/RECEIPT',
      bank_statement: 'BANK STATEMENT',
      salary_slip: 'SALARY SLIP',
      insurance: 'INSURANCE POLICY',
      medical_document: 'MEDICAL DOCUMENT',
      property_document: 'PROPERTY DOCUMENT',
      contract: 'CONTRACT/AGREEMENT',
      legal_document: 'LEGAL DOCUMENT'
    }

    const emoji = typeEmojis[docType] || '📄'
    const typeName = typeNames[docType] || 'DOCUMENT'

    let formatted = `${emoji} ${typeName} - ${filename}
${'='.repeat(60)}
🎯 Auto-Detected Type: ${typeName} (Confidence: ${confidence}/5)
${'='.repeat(60)}

`

    // Add extracted fields
    const fieldLabels: { [key: string]: string } = {
      name: '👤 Name',
      fatherName: '👨 Father\'s Name',
      motherName: '👩 Mother\'s Name',
      dateOfBirth: '📅 Date of Birth',
      gender: '⚧ Gender',
      age: '🎂 Age',
      address: '🏠 Address',
      phone: '📞 Phone',
      email: '📧 Email',
      idNumber: '🆔 ID Number',
      rollNumber: '🎫 Roll Number',
      registrationNumber: '📋 Registration Number',
      issueDate: '📅 Issue Date',
      expiryDate: '📅 Expiry Date',
      date: '📅 Date',
      amount: '💰 Amount',
      balance: '💰 Balance',
      salary: '💰 Salary',
      degree: '🎓 Degree',
      university: '🏫 University',
      year: '📅 Year',
      result: '🏆 Result',
      diagnosis: '🔬 Diagnosis',
      doctor: '👨‍⚕️ Doctor',
      caseNumber: '⚖️ Case Number',
      court: '🏛️ Court',
      place: '📍 Place',
      purpose: '🎯 Purpose',
      status: '📊 Status'
    }

    // Add non-null fields
    Object.entries(fields).forEach(([key, value]) => {
      if (value && fieldLabels[key]) {
        formatted += `${fieldLabels[key]}: ${value}\n`
      }
    })

    formatted += `\n📝 Full Text:\n${text}\n${'='.repeat(60)}\n\n`
    return formatted
  }

  // Generate universal structured output for unknown document types
  const generateUniversalStructuredOutput = (text: string, filename: string, fields: any) => {
    let formatted = `📄 UNIVERSAL DOCUMENT - ${filename}
${'='.repeat(60)}
🤖 Auto-Analyzed Document (Unknown Type)
${'='.repeat(60)}

`

    // Add extracted fields
    const fieldLabels: { [key: string]: string } = {
      name: '👤 Name',
      fatherName: '👨 Father\'s Name',
      motherName: '👩 Mother\'s Name',
      dateOfBirth: '📅 Date of Birth',
      gender: '⚧ Gender',
      age: '🎂 Age',
      address: '🏠 Address',
      phone: '📞 Phone',
      email: '📧 Email',
      idNumber: '🆔 ID Number',
      rollNumber: '🎫 Roll Number',
      registrationNumber: '📋 Registration Number',
      issueDate: '📅 Issue Date',
      expiryDate: '📅 Expiry Date',
      date: '📅 Date',
      amount: '💰 Amount',
      balance: '💰 Balance',
      salary: '💰 Salary',
      degree: '🎓 Degree',
      university: '🏫 University',
      year: '📅 Year',
      result: '🏆 Result',
      diagnosis: '🔬 Diagnosis',
      doctor: '👨‍⚕️ Doctor',
      caseNumber: '⚖️ Case Number',
      court: '🏛️ Court',
      place: '📍 Place',
      purpose: '🎯 Purpose',
      status: '📊 Status'
    }

    // Add non-null fields
    let hasFields = false
    Object.entries(fields).forEach(([key, value]) => {
      if (value && fieldLabels[key]) {
        formatted += `${fieldLabels[key]}: ${value}\n`
        hasFields = true
      }
    })

    if (!hasFields) {
      formatted += `🔍 No structured fields detected. Document may contain unstructured text.\n`
    }

    formatted += `\n📝 Full Text:\n${text}\n${'='.repeat(60)}\n\n`
    return formatted
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

  const processPDF = async (file: File) => {
    try {
      // Convert File to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer()
      
      // For client-side PDF processing, we'll use PDF.js
      // Import PDF.js dynamically to avoid SSR issues
      const pdfjsLib = await import('pdfjs-dist')
      
      // Set up PDF.js worker
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`
      
      // Load the PDF document
      const pdf = await pdfjsLib.getDocument({ 
        data: arrayBuffer,
        useWorkerFetch: false,
        isEvalSupported: false,
        useSystemFonts: true
      }).promise
      
      let fullText = ''
      
      // Extract text from each page
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum)
        const textContent = await page.getTextContent()
        
        // Combine text items from the page
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ')
        
        fullText += pageText + '\n\n'
      }
      
      // Clean up the text
      const cleanedText = fullText
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/\n\s*\n/g, '\n\n') // Clean up multiple newlines
        .trim()
      
      if (!cleanedText) {
        throw new Error('No text content found in PDF')
      }
      
      // Format the text output
      return formatTextOutput(cleanedText, file.name)
    } catch (error) {
      console.error('PDF processing error:', error)
      
      // If PDF.js fails, try a fallback approach
      try {
        // Simple fallback: try to extract text using a basic approach
        const arrayBuffer = await file.arrayBuffer()
        const uint8Array = new Uint8Array(arrayBuffer)
        
        // Convert to string and try to extract readable text
        let text = ''
        for (let i = 0; i < uint8Array.length; i++) {
          const char = String.fromCharCode(uint8Array[i])
          if (char.match(/[a-zA-Z0-9\s.,!?;:()\-]/)) {
            text += char
          }
        }
        
        // Clean up the extracted text
        const cleanedText = text
          .replace(/\s+/g, ' ')
          .replace(/[^\w\s.,!?;:()\-]/g, '')
          .trim()
        
        if (cleanedText.length > 50) {
          return cleanedText
        } else {
          throw new Error('Unable to extract meaningful text from PDF')
        }
      } catch (fallbackError) {
        throw new Error('Failed to process PDF file. The PDF might be image-based or corrupted.')
      }
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsProcessing(true)
    
    for (const file of acceptedFiles) {
      try {
        const text = await processPDF(file)
        
        setProcessedFiles(prev => [...prev, {
          name: file.name,
          text,
          status: 'success'
        }])
        
        onTextExtracted(text, file.name)
        toast.success(`PDF processed: ${file.name}`)
      } catch (error) {
        setProcessedFiles(prev => [...prev, {
          name: file.name,
          text: '',
          status: 'error'
        }])
        toast.error(`Failed to process: ${file.name}`)
      }
    }
    
    setIsProcessing(false)
  }, [onTextExtracted])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true,
    disabled: isProcessing
  })

  const downloadAllText = () => {
    const allText = processedFiles
      .filter(file => file.status === 'success')
      .map(file => `=== ${file.name} ===\n${file.text}\n\n`)
      .join('')

    if (allText) {
      const blob = new Blob([allText], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `pdf-extracted-text-${Date.now()}.txt`
      link.click()
      URL.revokeObjectURL(url)
      toast.success('All text downloaded!')
    }
  }

  const clearAll = () => {
    setProcessedFiles([])
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
          <FileText className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
          PDF to Text Converter
        </h2>
        <div className="flex items-center space-x-2">
          {processedFiles.length > 0 && (
            <>
              <button
                onClick={downloadAllText}
                className="btn-secondary text-sm flex items-center"
              >
                <Download className="w-4 h-4 mr-1" />
                Download All
              </button>
              <button
                onClick={clearAll}
                className="btn-secondary text-sm"
              >
                Clear
              </button>
            </>
          )}
        </div>
      </div>

      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 mb-4
          ${isDragActive 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
          }
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <FileText className="w-12 h-12 text-primary-500 mx-auto mb-4" />
        <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
          Drop PDF files here or click to select
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Supports PDF documents up to 10MB each
        </p>
        {isProcessing && (
          <div className="mt-4 flex items-center justify-center space-x-2 text-primary-600">
            <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Processing PDFs...</span>
          </div>
        )}
      </div>

      {/* Processed Files List */}
      {processedFiles.length > 0 && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {processedFiles.map((file, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-8 h-8 rounded bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                  {file.status === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {file.status === 'success' ? 'Text extracted successfully' : 'Processing failed'}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Enhanced Info */}
      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="text-sm text-blue-800 dark:text-blue-200">
          <p className="font-medium mb-2">Enhanced PDF Processing Features:</p>
          <ul className="space-y-1 text-xs">
            <li>• Extract text from PDF documents using PDF.js v3.11.174</li>
            <li>• Support for multiple PDF files (batch processing)</li>
            <li>• Process text-based PDFs with high accuracy</li>
            <li>• Advanced text cleaning and formatting</li>
            <li>• Fallback processing for complex PDFs</li>
            <li>• Support for encrypted and password-protected PDFs</li>
            <li>• Multi-page document processing</li>
            <li>• Download extracted text in multiple formats</li>
            <li>• Real-time processing status updates</li>
            <li>• Error handling and recovery mechanisms</li>
          </ul>
          <p className="mt-2 text-xs">
            <strong>Note:</strong> Works best with text-based PDFs. Image-based PDFs may require OCR processing through the Image to Text converter.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
