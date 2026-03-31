using System.Windows;
using WpfApp1.Models;

namespace WpfApp1
{
    public partial class EditCarMakerWindow : Window
    {
        public CarMakerDTO UpdatedCarMaker { get; private set; }

        public EditCarMakerWindow(CarMakerDTO carMaker)
        {
            InitializeComponent();
            UpdatedCarMaker = carMaker;
            BrandEnglishTextBox.Text = carMaker.BrandEnglish;
        }

        private void SaveButton_Click(object sender, RoutedEventArgs e)
        {
            // Validate that both fields are filled
            if (string.IsNullOrEmpty(BrandEnglishTextBox.Text))
            {
                MessageBox.Show("A márka nevét ki kell tölteni!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                return;
            }

            // If both fields are filled, proceed with saving the data
            UpdatedCarMaker.BrandEnglish = BrandEnglishTextBox.Text;

            DialogResult = true;
            Close();
        }

        private void CancelButton_Click(object sender, RoutedEventArgs e)
        {
            DialogResult = false;
            Close();
        }
    }
}