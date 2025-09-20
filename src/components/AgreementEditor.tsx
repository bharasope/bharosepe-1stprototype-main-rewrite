
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Save, RefreshCw, Send, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AgreementEditorProps {
  agreement: string;
  onSave: (editedAgreement: string) => void;
  onSend: (finalAgreement: string) => void;
  onRegenerate: () => void;
  transactionData: any;
}

const AgreementEditor: React.FC<AgreementEditorProps> = ({
  agreement,
  onSave,
  onSend,
  onRegenerate,
  transactionData
}) => {
  const [editedAgreement, setEditedAgreement] = useState(agreement);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const handleSave = () => {
    onSave(editedAgreement);
    setIsEditing(false);
  };

  const handleSend = () => {
    onSend(editedAgreement);
  };

  const formatAgreementForDisplay = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-2xl font-bold text-bharose-primary mb-4">{line.substring(2)}</h1>;
      } else if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-semibold text-gray-800 mt-6 mb-3">{line.substring(3)}</h2>;
      } else if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-medium text-gray-700 mt-4 mb-2">{line.substring(4)}</h3>;
      } else if (line.startsWith('- ')) {
        return <li key={index} className="ml-4 mb-1 text-gray-600">{line.substring(2)}</li>;
      } else if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={index} className="font-semibold text-gray-700 mb-2">{line.slice(2, -2)}</p>;
      } else if (line.trim() === '') {
        return <br key={index} />;
      } else if (line.includes('₹')) {
        return <p key={index} className="text-gray-600 mb-1 font-medium text-bharose-primary">{line}</p>;
      } else {
        return <p key={index} className="text-gray-600 mb-1">{line}</p>;
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="bg-white rounded-lg shadow-sm p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Agreement Generated</h1>
              <p className="text-gray-600">Review and customize your agreement before sending</p>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              AI Generated
            </Badge>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2"
            >
              <Edit3 size={16} />
              {isEditing ? 'Cancel Edit' : 'Edit Agreement'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2"
            >
              {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>

            <Button
              variant="outline"
              onClick={onRegenerate}
              className="flex items-center gap-2 text-bharose-primary border-bharose-primary"
            >
              <RefreshCw size={16} />
              Regenerate with AI
            </Button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor Section */}
          <motion.div
            className="bg-white rounded-lg shadow-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-800">
                {isEditing ? 'Edit Agreement' : 'Agreement Content'}
              </h2>
            </div>
            <div className="p-4">
              {isEditing ? (
                <div className="space-y-4">
                  <textarea
                    value={editedAgreement}
                    onChange={(e) => setEditedAgreement(e.target.value)}
                    className="w-full h-96 p-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-bharose-primary focus:border-transparent"
                    placeholder="Edit your agreement here..."
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="bg-bharose-primary hover:bg-bharose-primary/90">
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <pre className="whitespace-pre-wrap font-mono text-sm text-gray-600">
                    {editedAgreement}
                  </pre>
                </div>
              )}
            </div>
          </motion.div>

          {/* Preview Section */}
          {showPreview && (
            <motion.div
              className="bg-white rounded-lg shadow-sm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-800">Preview</h2>
                <p className="text-sm text-gray-600">How the agreement will appear</p>
              </div>
              <div className="p-4 h-96 overflow-y-auto">
                <div className="prose prose-sm max-w-none">
                  {formatAgreementForDisplay(editedAgreement)}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        <motion.div
          className="bg-white rounded-lg shadow-sm p-6 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">Ready to send?</h3>
              <p className="text-sm text-gray-600">
                This agreement will be sent to {transactionData?.contact?.name}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => window.print()}
              >
                Download PDF
              </Button>
              <Button
                onClick={handleSend}
                className="bg-bharose-primary hover:bg-bharose-primary/90"
              >
                <Send size={16} className="mr-2" />
                Send Agreement
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AgreementEditor;
