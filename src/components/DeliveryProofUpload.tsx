
import React, { useState } from 'react';
import { Upload, File, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEnhancedTransactionStore } from '@/utils/enhancedTransactionState';
import { toast } from 'sonner';

interface DeliveryProofUploadProps {
  transactionId: string;
  onUploadComplete: () => void;
}

const DeliveryProofUpload: React.FC<DeliveryProofUploadProps> = ({
  transactionId,
  onUploadComplete
}) => {
  const [description, setDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const { addDeliveryProof } = useEnhancedTransactionStore();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one file');
      return;
    }

    setUploading(true);

    try {
      // Simulate file upload - in real app, this would upload to storage
      for (const file of selectedFiles) {
        const mockFileUrl = `https://example.com/files/${file.name}`;
        
        addDeliveryProof({
          transactionId,
          fileName: file.name,
          fileUrl: mockFileUrl,
          description: description || `Delivery proof: ${file.name}`,
        });
      }

      toast.success('Delivery proof uploaded successfully!');
      onUploadComplete();
    } catch (error) {
      toast.error('Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bharose-card">
      <h3 className="font-medium mb-4">Upload Delivery Proof</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Description (Optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details about the delivery..."
            className="w-full p-3 border border-border rounded-lg resize-none"
            rows={3}
          />
        </div>

        <div className="border-2 border-dashed border-border rounded-lg p-6">
          <input
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center cursor-pointer"
          >
            <Upload size={48} className="text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground text-center">
              Click to upload delivery proof<br />
              <span className="text-xs">Images, PDF, or documents</span>
            </p>
          </label>
        </div>

        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Selected Files:</p>
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <File size={16} />
                  <span className="text-sm">{file.name}</span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-bharose-error hover:bg-bharose-error/10 p-1 rounded"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={uploading || selectedFiles.length === 0}
          className="w-full"
        >
          {uploading ? 'Uploading...' : 'Upload Proof & Mark as Delivered'}
        </Button>
      </div>
    </div>
  );
};

export default DeliveryProofUpload;
