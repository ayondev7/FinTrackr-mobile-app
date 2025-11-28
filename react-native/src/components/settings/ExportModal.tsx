import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { X, Download, FileText, CheckCircle, FileJson, FileSpreadsheet } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from '../shared/Card';
import { ExportData } from '../../types';
import { useToastStore } from '../../store/toastStore';

interface ExportModalProps {
  visible: boolean;
  onClose: () => void;
  primaryColor: string;
  onExport: (format: 'csv' | 'json' | 'pdf') => Promise<ExportData | null>;
  isLoading?: boolean;
}

// Convert export data to CSV format
const convertToCSV = (data: ExportData): string => {
  const lines: string[] = [];
  
  // Header info
  lines.push('FinTrackr Data Export');
  lines.push(`Exported At,${data.exportedAt}`);
  lines.push('');
  
  // Profile section
  lines.push('PROFILE');
  lines.push(`Name,${data.profile.name}`);
  lines.push(`Email,${data.profile.email}`);
  lines.push(`Currency,${data.profile.currency}`);
  lines.push('');
  
  // Balances section
  lines.push('BALANCES');
  lines.push(`Cash,${data.balances.cash}`);
  lines.push(`Bank,${data.balances.bank}`);
  lines.push(`Digital,${data.balances.digital}`);
  lines.push(`Total,${data.balances.total}`);
  lines.push('');
  
  // Summary section
  lines.push('SUMMARY');
  lines.push(`Total Transactions,${data.summary.totalTransactions}`);
  lines.push(`Total Expenses,${data.summary.totalExpenses}`);
  lines.push(`Total Revenue,${data.summary.totalRevenue}`);
  lines.push('');
  
  // Transactions section
  lines.push('TRANSACTIONS');
  lines.push('Date,Type,Category,Amount,Account,Name,Description');
  
  data.transactions.forEach((txn) => {
    const date = new Date(txn.date).toLocaleDateString();
    const name = (txn.name || '').replace(/,/g, ';');
    const description = (txn.description || '').replace(/,/g, ';');
    lines.push(`${date},${txn.type},${txn.category},${txn.amount},${txn.accountType},${name},${description}`);
  });
  
  return lines.join('\n');
};

// Convert export data to HTML for PDF
const convertToHTML = (data: ExportData): string => {
  const formatCurrency = (amount: number) => `${data.profile.currency} ${amount.toFixed(2)}`;
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString();
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>FinTrackr Export</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
        h1 { color: #4F46E5; border-bottom: 2px solid #4F46E5; padding-bottom: 10px; }
        h2 { color: #6366F1; margin-top: 30px; }
        .section { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; }
        .grid { display: flex; gap: 20px; flex-wrap: wrap; }
        .card { background: white; padding: 15px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); min-width: 150px; }
        .card-label { font-size: 12px; color: #666; }
        .card-value { font-size: 18px; font-weight: bold; margin-top: 5px; }
        .expense { color: #EF4444; }
        .revenue { color: #22C55E; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #4F46E5; color: white; }
        tr:nth-child(even) { background: #f8f9fa; }
        .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <h1>📊 FinTrackr Data Export</h1>
      <p>Exported on ${formatDate(data.exportedAt)}</p>
      
      <h2>👤 Profile</h2>
      <div class="section">
        <p><strong>Name:</strong> ${data.profile.name}</p>
        <p><strong>Email:</strong> ${data.profile.email}</p>
        <p><strong>Currency:</strong> ${data.profile.currency}</p>
      </div>
      
      <h2>💰 Balances</h2>
      <div class="section">
        <div class="grid">
          <div class="card">
            <div class="card-label">Cash</div>
            <div class="card-value">${formatCurrency(data.balances.cash)}</div>
          </div>
          <div class="card">
            <div class="card-label">Bank</div>
            <div class="card-value">${formatCurrency(data.balances.bank)}</div>
          </div>
          <div class="card">
            <div class="card-label">Digital</div>
            <div class="card-value">${formatCurrency(data.balances.digital)}</div>
          </div>
          <div class="card">
            <div class="card-label">Total</div>
            <div class="card-value" style="color: #4F46E5;">${formatCurrency(data.balances.total)}</div>
          </div>
        </div>
      </div>
      
      <h2>📈 Summary</h2>
      <div class="section">
        <div class="grid">
          <div class="card">
            <div class="card-label">Total Transactions</div>
            <div class="card-value">${data.summary.totalTransactions}</div>
          </div>
          <div class="card">
            <div class="card-label">Total Expenses</div>
            <div class="card-value expense">${formatCurrency(data.summary.totalExpenses)}</div>
          </div>
          <div class="card">
            <div class="card-label">Total Revenue</div>
            <div class="card-value revenue">${formatCurrency(data.summary.totalRevenue)}</div>
          </div>
        </div>
      </div>
      
      <h2>📝 Transactions (${data.transactions.length})</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Account</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          ${data.transactions.map(txn => `
            <tr>
              <td>${formatDate(txn.date)}</td>
              <td class="${txn.type}">${txn.type.toUpperCase()}</td>
              <td>${txn.category}</td>
              <td class="${txn.type}">${formatCurrency(txn.amount)}</td>
              <td>${txn.accountType}</td>
              <td>${txn.name || '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="footer">
        <p>Generated by FinTrackr App</p>
      </div>
    </body>
    </html>
  `;
};

export const ExportModal = ({ visible, onClose, primaryColor, onExport, isLoading = false }: ExportModalProps) => {
  const [exportingFormat, setExportingFormat] = React.useState<'csv' | 'json' | 'pdf' | null>(null);
  const { showSuccess, showError } = useToastStore();

  const exportOptions = [
    {
      format: 'json' as const,
      title: 'JSON Format',
      description: 'Complete data in JSON format',
      icon: FileJson,
    },
    {
      format: 'csv' as const,
      title: 'CSV Format',
      description: 'Spreadsheet-friendly format',
      icon: FileSpreadsheet,
    },
    {
      format: 'pdf' as const,
      title: 'PDF Report',
      description: 'Formatted document with styling',
      icon: FileText,
    },
  ];

  const handleExport = async (format: 'csv' | 'json' | 'pdf') => {
    setExportingFormat(format);
    
    try {
      const data = await onExport(format);
      
      if (!data) {
        setExportingFormat(null);
        return;
      }

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      let fileUri = '';
      let mimeType = '';
      let filename = '';

      if (format === 'pdf') {
        // Generate PDF using expo-print
        const html = convertToHTML(data);
        const result = await Print.printToFileAsync({ html });
        fileUri = result.uri;
        mimeType = 'application/pdf';
        filename = `fintrackr-export-${timestamp}.pdf`;
      } else {
        // Generate file content for JSON/CSV
        const content = format === 'json' 
          ? JSON.stringify(data, null, 2) 
          : convertToCSV(data);
        
        filename = `fintrackr-export-${timestamp}.${format}`;
        fileUri = `${FileSystem.documentDirectory}${filename}`;
        mimeType = format === 'json' ? 'application/json' : 'text/csv';
        
        // Write file to device
        await FileSystem.writeAsStringAsync(fileUri, content);
      }

      // Handle saving/sharing
      if (Platform.OS === 'android') {
        try {
          const EXPORT_DIR_KEY = 'fintrackr_export_dir_uri';
          let directoryUri = await AsyncStorage.getItem(EXPORT_DIR_KEY);
          let saved = false;

          if (directoryUri) {
            try {
              const base64 = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
              const createdUri = await FileSystem.StorageAccessFramework.createFileAsync(directoryUri, filename, mimeType);
              await FileSystem.writeAsStringAsync(createdUri, base64, { encoding: FileSystem.EncodingType.Base64 });
              saved = true;
              showSuccess('Export Saved', 'File saved to your selected folder');
            } catch (e) {
              console.log("Saved URI failed, requesting new permission");
              directoryUri = null; // Reset to force permission request
            }
          }

          if (!saved) {
            const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
            if (permissions.granted) {
              await AsyncStorage.setItem(EXPORT_DIR_KEY, permissions.directoryUri);
              const base64 = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
              const createdUri = await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, filename, mimeType);
              await FileSystem.writeAsStringAsync(createdUri, base64, { encoding: FileSystem.EncodingType.Base64 });
              showSuccess('Export Saved', 'File saved successfully');
            } else {
              // Fallback to share if user cancels folder picker
              if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri, { mimeType, dialogTitle: `Save ${filename}` });
              }
            }
          }
        } catch (e) {
          console.log("SAF failed, falling back to share", e);
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri, { mimeType, dialogTitle: `Save ${filename}` });
          }
        }
      } else {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType,
            dialogTitle: `Save ${filename}`,
          });
        }
      }
      
      setExportingFormat(null);
      onClose();
    } catch (error) {
      console.error('Export error:', error);
      showError('Export Failed', 'An error occurred while exporting data');
      setExportingFormat(null);
    }
  };

  const isExporting = isLoading || exportingFormat !== null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={isExporting ? undefined : onClose}
    >
      <View className="flex-1 bg-black/50">
        <View className="flex-1 mt-20 bg-gray-50 dark:bg-slate-900 rounded-t-3xl">
          <View className="flex-row items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <Text className="text-gray-900 dark:text-white text-xl font-bold">
              Export Data
            </Text>
            <TouchableOpacity 
              onPress={onClose} 
              className="p-2"
              disabled={isExporting}
              style={{ opacity: isExporting ? 0.5 : 1 }}
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <ScrollView className="flex-1 p-6">
            <View className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
              <View className="flex-row items-center gap-2 mb-2">
                <CheckCircle size={16} color="#3B82F6" />
                <Text className="text-blue-800 dark:text-blue-300 font-semibold">
                  What's included?
                </Text>
              </View>
              <Text className="text-blue-700 dark:text-blue-400 text-sm">
                • Profile info (name, email){'\n'}
                • Account balances{'\n'}
                • All transactions with categories{'\n'}
                • Summary statistics
              </Text>
            </View>

            <Text className="text-gray-900 dark:text-white font-semibold mb-3">
              Choose Export Format
            </Text>

            {exportOptions.map((option) => {
              const Icon = option.icon;
              const isThisExporting = exportingFormat === option.format;
              
              return (
                <TouchableOpacity
                  key={option.format}
                  onPress={() => handleExport(option.format)}
                  activeOpacity={0.7}
                  disabled={isExporting}
                  style={{ opacity: isExporting && !isThisExporting ? 0.5 : 1 }}
                >
                  <Card className="mb-3 p-4">
                    <View className="flex-row items-center gap-3">
                      <View
                        className="w-12 h-12 rounded-xl items-center justify-center"
                        style={{ backgroundColor: `${primaryColor}20` }}
                      >
                        <Icon size={24} color={primaryColor} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-gray-900 dark:text-white font-semibold mb-1">
                          {option.title}
                        </Text>
                        <Text className="text-gray-500 dark:text-gray-400 text-xs">
                          {option.description}
                        </Text>
                      </View>
                      {isThisExporting ? (
                        <ActivityIndicator size="small" color={primaryColor} />
                      ) : (
                        <Download size={20} color="#9CA3AF" />
                      )}
                    </View>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
